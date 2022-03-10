const mongoose = require('mongoose');
const config = require('../../config/config');
const logger = require('../../config/winston');

/**
 * Initialize database connection.
 *
 * @param  {Context} context
 */
const initializeDBConnection = async () => {
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
  });
  logger.info('Successfully connected to database.');
};

const createRegularIndex = (collectionName, keys) =>
  mongoose.connection.db.collection(collectionName).createIndex(keys);

const createGeoDataIndex = async (collectionName, geoKey = 'geometry') => {
  const indexKey = {};
  indexKey[geoKey] = '2dsphere';
  await mongoose.connection.db.collection(collectionName).createIndex(indexKey);
};

const createCollection = async (collectionName, index, geoIndex) => {
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

/**
 * Disconnect from the database.
 *
 * @param  {Context} context
 */

const disconnectFromDB = async () => {
  await mongoose.disconnect();
  logger.info('Successfully disconnected from database.');
};

const removeDB = async () => {
  await mongoose.deleteModel(/.+/);
  await mongoose.connection.dropDatabase();
  logger.info('Successfully dropped database.');
};

module.exports = {
  initializeDBConnection,
  createRegularIndex,
  createGeoDataIndex,
  createCollection,
  disconnectFromDB,
  removeDB,
};
