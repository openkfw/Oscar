import Bottleneck from 'bottleneck';
import { Context } from '@azure/functions';
import Joi from '@hapi/joi';
import mongoose from 'mongoose';
import { Attribute } from './types';
import config from './config';
import { dbDataSchema } from './joiSchemas';

const limiter = new Bottleneck({
  maxConcurrent: config.bottleneckMaxConcurrent,
  minTime: config.bottleneckTimeLimit,
});

/**
 * Initialize database connection.
 *
 * @param  {Context} context
 */
export const initializeDBConnection = async (context: Context) => {
  context.log('Connecting to database ...');
  if (process.env.NODE_ENV !== 'test') {
    await mongoose.set('debug', (collectionName, method, query, doc) => {
      context.log(`Mongoose - ${method} on collection ${collectionName} `, {
        collection: collectionName,
        method,
        query,
        stack: JSON.stringify(doc), // log content of doc at the end
      });
    });
  }
  await mongoose.connect(config.mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 360000,
    socketTimeoutMS: 360000,
  });
  context.log('DB Connection successful');
};

/**
 * Get sum of cases for set date interval
 * @param  {string} collectionName
 * @param  {string} attributeId
 * @param  {string} dateTo - end day for the sum interval
 * @param  {string} dateFrom - start day for the sum interval
 */
export const getCasesSum = async (collectionName: string, attributeId: string, dateTo: string, dateFrom: string) => {
  const { connection } = mongoose;
  const { db } = connection;

  const sums = await db
    .collection(collectionName)
    .aggregate([
      {
        $match: {
          date: { $lte: dateTo, $gte: dateFrom },
          attributeId,
        },
      },
      {
        $group: {
          _id: { featureId: '$featureId' },
          featureId: { $first: '$featureId' },
          sum: { $sum: '$valueNumber' },
          count: { $sum: 1 },
        },
      },
    ])
    .toArray();
  return sums;
};

/**
 * Gets population for selected list of featureIds
 * @param  {string} collectionName
 * @param  {string} attributeId - id of attribute with population data
 * @param  {Array<string>} featureIds - list of featureIds to fetch population data for
 */
export const getPopulationDataForFeatures = async (
  collectionName: string,
  attributeId: string,
  featureIds: Array<string>,
) => {
  const { connection } = mongoose;
  const { db } = connection;

  const populations = await db
    .collection(collectionName)
    .find({ attributeId, featureId: { $in: featureIds } })
    .toArray();
  return populations;
};

/**
 * Count all cases in country from values from all features by attributeId and population data sum
 * @param  {string} collectionName
 * @param  {string} attributeId - attribute to get sum for
 * @param  {string} populationAttributeId - attribute to get country population
 * @param  {string} dateTo - end day for the sum interval
 * @param  {string} dateFrom - start day for the sum interval
 */
export const getCountryCasesAndPopulationSum = async (
  collectionName: string,
  attributeId: string,
  populationAttributeId: string,
  dateTo: string,
  dateFrom: string,
) => {
  const { connection } = mongoose;
  const { db } = connection;
  const mongodbFilter = [
    {
      date: { $lte: dateTo, $gte: dateFrom },
      attributeId,
    },
    { attributeId: populationAttributeId },
  ];

  const sums = await db
    .collection(collectionName)
    .aggregate([
      {
        $match: { $or: mongodbFilter },
      },
      {
        $group: {
          _id: null,
          featureId: { $first: '$featureId' },
          attributeId: { $first: '$attributeId' },
          sum: { $sum: '$valueNumber' },
        },
      },
    ])
    .toArray();
  return sums;
};

/**
 * Store data to database.
 *
 * @param  {string} collectionName Name of the collection.
 * @param  {Array<Attribute>} data Data to insert
 */
export const storeToDb = async (collectionName: string, data: Array<Attribute>) => {
  Joi.assert(data, dbDataSchema);
  const operations = data.map((item: Attribute) => ({
    updateOne: {
      filter: {
        date: { $regex: `${item.date.substring(0, item.date.indexOf('T'))}*` },
        featureId: item.featureId,
        attributeId: item.attributeId,
      },
      update: {
        $set: item,
      },
      upsert: true,
    },
  }));

  // bulkWrite is split to smaller batches as it takes more than 1 minute
  // CosmosDB with MongoDB driver has max 1 minute operation execution time
  // for some mongo queries it is possible to set maxTimeMS, to set this for a longer time but not for bulkWrite
  const { connection } = mongoose;
  const { db } = connection;
  const numberOfOperations = Math.ceil(operations.length / 10);
  const allTasks = Array(numberOfOperations)
    .fill(1)
    .map((_, i) =>
      limiter.schedule(() =>
        db
          .collection(collectionName)
          .bulkWrite(operations.slice(i * 10, Math.min(i * 10 + 10, operations.length)), { ordered: false }),
      ),
    );

  await Promise.all(allTasks);
};

/**
 * Disconnect from the database.
 *
 * @param  {Context} context
 */
export const disconnectFromDB = async (context: Context) => {
  await mongoose.disconnect();
  context.log('Successfully disconnected from database.');
};

/**
 * Drop the database
 *
 * @param  {Context} context
 */
export const removeDB = async (context: Context) => {
  await mongoose.deleteModel(/.+/);
  await mongoose.connection.dropDatabase();
  context.log('Database dropped successfully');
};
