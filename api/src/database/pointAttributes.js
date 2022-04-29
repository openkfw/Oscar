const config = require('../config/config');
const APIError = require('../helpers/APIError');

const mongoDb = require('./mongoDb/models/pointAttributesModel');

/**
 * @param  {string} attributeId
 * @param  {string} bottomLeft - bottom left corner, string with lon,lat divided by ','
 * @param  {string} topRight - top right corner, string with lon, lat divided by ','
 * @param  {string} dateStart - start of date interval
 * @param  {string} dateEnd - end of date interval
 * @param  {boolean} lastDate - return values in database for last date
 */
const getPointAttributes = async (attributeId, bottomLeft, topRight, dateStart, dateEnd, lastDate) => {
  if (lastDate) {
    if (config.mongoUri) {
      return mongoDb.getLastDatePointAttributes(attributeId, bottomLeft, topRight);
    }
    throw new APIError('No connection string to database', 500, false);
  } else {
    if (config.mongoUri) {
      return mongoDb.getFilteredPointAttributes(attributeId, bottomLeft, topRight, dateStart, dateEnd);
    }
    throw new APIError('No connection string to database', 500, false);
  }
};

/**
 * Returns array with unique values for given property in items with given attributeId
 * @param  {string} attributeId
 * @param  {string} property - key in properties object in item
 */
const getUniqueValues = async (attributeId, property) => {
  if (config.mongoUri) {
    return mongoDb.getUniqueValues(attributeId, property);
  }
  throw new APIError('No connection string to database', 500, false);
};

module.exports = { getPointAttributes, getUniqueValues };
