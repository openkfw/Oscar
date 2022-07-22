import config from '../config/config';
import APIError from '../helpers/APIError';

import mongoDb from './mongoDb/models/pointAttributesModel';
import postgis from './postgis/models/pointAttributesModel';

/**
 * @param  {string} attributeId
 * @param  {string} bottomLeft - bottom left corner, string with lon,lat divided by ','
 * @param  {string} topRight - top right corner, string with lon, lat divided by ','
 * @param  {string} dateStart - start of date interval
 * @param  {string} dateEnd - end of date interval
 * @param  {boolean} lastDate - return values in database for last date
 */
export const getPointAttributes = async (
  attributeId: string,
  bottomLeft: string,
  topRight: string,
  dateStart: string,
  dateEnd: string,
  lastDate: string,
) => {
  if (lastDate) {
    if (config.postgresUser && config.postgresPassword && config.postgresDb) {
      return postgis.getLastDatePointAttributes(attributeId, bottomLeft, topRight);
    }
    if (config.mongoUri) {
      return mongoDb.getLastDatePointAttributes(attributeId, bottomLeft, topRight);
    }
    throw new APIError('No credentials for database', 500, false, undefined);
  } else {
    if (config.postgresUser && config.postgresPassword && config.postgresDb) {
      return postgis.getFilteredPointAttributes(attributeId, bottomLeft, topRight, dateStart, dateEnd);
    }
    if (config.mongoUri) {
      return mongoDb.getFilteredPointAttributes(attributeId, bottomLeft, topRight, dateStart, dateEnd);
    }
    throw new APIError('No credentials for database', 500, false, undefined);
  }
};

/**
 * Returns array with unique values for given property in items with given attributeId
 * @param  {string} attributeId
 * @param  {string} property - key in properties object in item
 */
export const getUniqueValues = async (attributeId: string, property: string) => {
  if (config.postgresUser && config.postgresPassword && config.postgresDb) {
    return postgis.getUniqueValues(attributeId, property);
  }
  if (config.mongoUri) {
    return mongoDb.getUniqueValues(attributeId, property);
  }
  throw new APIError('No credentials for database', 500, false, undefined);
};

export default { getPointAttributes, getUniqueValues };
