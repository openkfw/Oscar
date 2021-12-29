const mongoose = require('mongoose');
const config = require('./config/config');
const logger = require('./config/winston');

const ATTRIBUTES_COLLECTION_NAME = 'featureAttributes';

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

/**
 * Creates DB indexes.
 */
const createIndexes = async () => {
  logger.info('Creating DB indexes...');
  await mongoose.connection.db.collection(ATTRIBUTES_COLLECTION_NAME).createIndex({ date: -1 });
  logger.info('Indexes created successfully...');
};

/**
 * Find latest date for data for given attributeId
 * @param  {string} attributeId
 */
const getLatestAttributeDate = async (attributeId) => {
  const { connection } = mongoose;
  const { db } = connection;

  const date = await db
    .collection(ATTRIBUTES_COLLECTION_NAME)
    .find({ attributeId })
    .sort({ date: -1 })
    .limit(1)
    .toArray();
  if (date.length) {
    return date[0].date;
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

module.exports = {
  initializeDBConnection,
  disconnectFromDB,
  getLatestAttributeDate,
  createIndexes,
};
