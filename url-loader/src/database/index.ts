/* eslint-disable import/no-named-as-default-member */
import config from '../config/config';

import mongoDb from './mongoDb';
import postgis from './postgis';

/**
 * Initializes database for which is provided connection string or throws error, when none found
 */
export const initializeDb = () => {
  if (config.postgresUser && config.postgresPassword && config.postgresDb) {
    return postgis.getDb();
  }
  if (config.mongoUri) {
    return mongoDb.initializeDBConnection();
  }
  throw new Error('No credentials for database');
};

export const disconnectFromDB = () => {
  if (config.postgresUser && config.postgresPassword && config.postgresDb) {
    return postgis.disconnect();
  }
  if (config.mongoUri) {
    return mongoDb.disconnectFromDB();
  }
  throw new Error('No credentials for database');
};

export const createCollection = (collectionName, index, geoIndex) => {
  if (config.mongoUri) {
    return mongoDb.createCollection(collectionName(collectionName, index, geoIndex));
  }
  throw new Error('No credentials for database');
};
