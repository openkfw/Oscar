import mongoose, { ConnectOptions } from 'mongoose';
import Bottleneck from 'bottleneck';
import config from '../../config/config';
import logger from '../../config/winston';

/**
 * Initialize database connection.
 *
 * @param  {Context} context
 */
export const initializeDBConnection = async () => {
  logger.info(`Connecting to database ...`);
  if (process.env.NODE_ENV !== 'test') {
    await mongoose.set('debug', (collectionName, method, query, doc) => {
      logger.debug(`Mongoose - ${method} on collection ${collectionName} `, {
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
    socketTimeoutMS: 200000,
    dbName: config.dbName,
  } as ConnectOptions);
  logger.info('Successfully connected to database.');
};

export const createRegularIndex = (collectionName, keys) =>
  mongoose.connection.db.collection(collectionName).createIndex(keys);

export const createGeoDataIndex = async (collectionName, geoKey = 'geometry') => {
  const indexKey = {};
  indexKey[geoKey] = '2dsphere';
  await mongoose.connection.db.collection(collectionName).createIndex(indexKey);
};

export const createCollection = async (collectionName, index, geoIndex) => {
  if (!collectionName || collectionName === '') {
    logger.error('Collection name missing, unable to create');
    return;
  }
  if (index) {
    createRegularIndex(collectionName, index);
  }
  if (geoIndex) {
    createGeoDataIndex(collectionName, geoIndex);
  }
};

export const deleteAllFromCollection = async (collectionName) => {
  await mongoose.connection.db.collection(collectionName).deleteMany({});
};

const limiter = new Bottleneck({
  maxConcurrent: config.bottleneckMaxConcurrent,
  minTime: config.bottleneckTimeLimit,
});

export const bulkStoreToDb = async (collectionName, operations, options) => {
  // bulkWrite is split to smaller batches as it takes more than 1 minute
  // CosmosDB with MongoDB driver has max 1 minute operation execution time
  // for some mongo queries it is possible to set maxTimeMS, to set this for a linger time but not for bulkWrite
  const { connection } = mongoose;
  const { db } = connection;
  const BULK_SIZE = options.bulkWrite || 10;
  const numberOfOperations = Math.ceil(operations.length / BULK_SIZE);
  const allTasks = Array(numberOfOperations)
    .fill(1)
    .map((_, i) =>
      limiter.schedule(() =>
        db
          .collection(collectionName)
          .bulkWrite(operations.slice(i * BULK_SIZE, Math.min(i * BULK_SIZE + BULK_SIZE, operations.length))),
      ),
    );

  await Promise.all(allTasks);
};

export const disconnectFromDB = async () => {
  await mongoose.disconnect();
  logger.info('Successfully disconnected from database.');
};

export const removeDB = async () => {
  await mongoose.deleteModel(/.+/);
  await mongoose.connection.dropDatabase();
  logger.info('Successfully dropped database.');
};

export default {
  initializeDBConnection,
  createRegularIndex,
  createGeoDataIndex,
  createCollection,
  deleteAllFromCollection,
  bulkStoreToDb,
  disconnectFromDB,
  removeDB,
};
