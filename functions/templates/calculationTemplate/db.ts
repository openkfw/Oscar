import Bottleneck from 'bottleneck';
import { Context } from '@azure/functions';
import Joi from '@hapi/joi';
import mongoose from 'mongoose';
import { Attribute, AttributesFilter } from './types';
import config from './config';
import { dbDataSchema } from './joiSchemas';
import { COLLECTION_NAME } from './constants';

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
    dbName: config.dbName,
  });
  context.log('DB Connection successful');
};

/**
 * Gets features by date and attributes and groups by featureId.
 * @param {Array<AttributesFilter>} filterData - array of date and attributeId for data
 */
export const getFromDb = async (filterData: Array<AttributesFilter>) => {
  const { connection } = mongoose;
  const { db } = connection;

  const mongodbFilter = [];
  filterData.forEach((item) =>
    mongodbFilter.push({ attributeId: item.attributeId, date: { $regex: `^${item.date}` } }),
  );

  const dataByFeatureId = await db
    .collection(COLLECTION_NAME)
    .aggregate([
      {
        $match: { $or: mongodbFilter },
      },
      {
        $sort: { date: -1, featureId: 1, attributeId: 1 },
      },
      {
        $group: {
          _id: { featureId: '$featureId', attributeId: '$attributeId' },
          date: { $first: '$date' },
          featureId: { $first: '$featureId' },
          attributeId: { $first: '$attributeId' },
          valueNumber: { $first: '$valueNumber' },
        },
      },
      {
        $group: {
          _id: { featureId: '$featureId' },
          features: {
            $push: {
              date: '$date',
              featureId: '$featureId',
              attributeId: '$attributeId',
              valueNumber: '$valueNumber',
            },
          },
        },
      },
    ])
    .toArray();

  return dataByFeatureId;
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
