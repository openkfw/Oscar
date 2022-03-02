const config = require('../config/config');
const APIError = require('../helpers/APIError');

const mongoDb = require('../database/mongoDb/models/pointAttributesModel');

/**
 * @param  {string} attributeId
 * @param  {string} bottomLeft - bottom left corner, string with lon,lat divided by ','
 * @param  {string} topRight - top right corner, string with lon, lat divided by ','
 */
const getPointAttributes = async (attributeId, bottomLeft, topRight) => {
  if (config.mongoUri && config.mongoUri !== '') {
    return mongoDb.getFilteredPointAttributes(attributeId, bottomLeft, topRight);
  }
  throw new APIError('No connection string to database', 500, false);
};
module.exports = { getPointAttributes };
