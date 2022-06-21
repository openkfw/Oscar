const config = require('../config/config');
const APIError = require('../helpers/APIError');

const mongoDb = require('./mongoDb/models/layerModel');

/**
 * Returns all map layers with correctly defined geographical data
 */
const getMapLayersWithGeoData = async () => {
  if (config.mongoUri) {
    return mongoDb.getMapLayersWithGeoData();
  }
  throw new APIError('No credentials for database', 500, false);
};

module.exports = { getMapLayersWithGeoData };
