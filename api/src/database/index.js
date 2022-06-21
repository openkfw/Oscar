const config = require('../config/config');
const APIError = require('../helpers/APIError');

const mongoDb = require('./mongoDb');

/**
 * Initializes database for which is provided connection string or throws error, when none found
 */
const initializeDb = () => {
  if (config.mongoUri) {
    return mongoDb.initializeDBConnection();
  }
  throw new APIError('No credentials for database', 500, false);
};

module.exports = { initializeDb };
