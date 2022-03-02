const config = require('../config/config');
const APIError = require('../helpers/APIError');

const mongoDb = require('../database/mongoDb/models/layerModel');

/**
 * Returns all map layers with correctly defined geographical data
 */
const getMapLayersWithGeoData = async () => {
  if (config.mongoUri && config.mongoUri !== '') {
    return mongoDb.getMapLayersWithGeoData();
  }
  throw new APIError('No connection string to database', 500, false);
};

module.exports = { getMapLayersWithGeoData };
