import config from '../config/config';
import APIError from '../helpers/APIError';

import mongoDb from './mongoDb/models/geoDataModel';
import postgis from './postgis/models/geoDataModel';

export const getGeoData = async (tableName: string, bottomLeft: string, topRight: string, proj: string) => {
  if (config.postgresUser && config.postgresPassword && config.postgresDb) {
    return postgis.getGeoData(tableName, bottomLeft, topRight, proj);
  }
  if (config.mongoUri) {
    return mongoDb.getGeoData(tableName, bottomLeft, topRight);
  }
  throw new APIError('No credentials for database', 500, false, undefined);
};

export const getProperty = async (tableName, propertyName) => {
  if (config.postgresUser && config.postgresPassword && config.postgresDb) {
    return postgis.getProperty(tableName, propertyName);
  }
  if (config.mongoUri) {
    return mongoDb.getProperty(tableName, propertyName);
  }
};

export const getUniqueValuesForProperty = async (tableName, propertyName) => {
  if (config.postgresUser && config.postgresPassword && config.postgresDb) {
    return postgis.getUniqueValuesForProperty(tableName, propertyName);
  }
  if (config.mongoUri) {
    return mongoDb.getUniqueValuesForProperty(tableName, propertyName);
  }
  throw new APIError('No credentials for database', 500, false, undefined);
};

export const getPropertySum = async (tableName, propertyName) => {
  if (config.postgresUser && config.postgresPassword && config.postgresDb) {
    return postgis.getPropertySum(tableName, propertyName);
  }
  if (config.mongoUri) {
    return mongoDb.getPropertySum(tableName, propertyName);
  }
};

export default { getGeoData, getProperty, getUniqueValuesForProperty, getPropertySum };
