const config = require('../config/config');

const mongoDb = require('./mongoDb');

/**
 * Initializes database for which is provided connection string or throws error, when none found
 */
const initializeDb = () => {
  if (config.mongoUri) {
    return mongoDb.initializeDBConnection();
  }
  throw new Error('No connection string to database');
};

const disconnectFromDB = () => {
  if (config.mongoUri) {
    return mongoDb.disconnectFromDB();
  }
  throw new Error('No connection string to database');
};

const createCollection = (collectionName, index, geoIndex) => {
  if (config.mongoUri) {
    return mongoDb.createCollection(collectionName(collectionName, index, geoIndex));
  }
  throw new Error('No connection string to database');
};

module.exports = { initializeDb, disconnectFromDB, createCollection };
