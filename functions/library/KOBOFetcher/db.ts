import Bottleneck from 'bottleneck';
import { Context } from '@azure/functions';
import Joi from 'joi';
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
 * Get latest KOBO update date from data stored in database
 * @param  {string} collectionName - name of collection with attributes
 * @param  {string} attributeId - attributeId for this data
 */
export const getLastDate = async (collectionName: string, attributeId: string) => {
  const { connection } = mongoose;
  const { db } = connection;
  const lastDateObj = await db
    .collection(collectionName)
    .find({ 'properties.attributeId': attributeId })
    .sort({ 'properties.updatedDate': -1 })
    .limit(1)
    .toArray();
  if (lastDateObj && lastDateObj.length && lastDateObj[0].properties) {
    return lastDateObj[0].properties.KOBO_update_time;
  }
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
        'properties.KOBO_uuid': item.properties.KOBO_uuid,
        'properties.attributeId': item.properties.attributeId,
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
