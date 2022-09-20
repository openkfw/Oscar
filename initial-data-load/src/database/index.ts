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

/**
 * Clears all data in given collection/table
 * @param  {string} collectionName - name of collection in mongodb or table in postgres
 */
export const clearCollection = (collectionName: string) => {
  if (config.postgresUser && config.postgresPassword && config.postgresDb) {
    return postgis.clearTable(collectionName);
  }
  if (config.mongoUri) {
    return mongoDb.deleteAllFromCollection(collectionName);
  }
  throw new Error('No credentials for database');
};

export const createCollection = (collectionName, index, geoIndex) => {
  if (config.postgresUser && config.postgresPassword && config.postgresDb) {
    return postgis.createGeometryTable(collectionName);
  }
  if (config.mongoUri) {
    return mongoDb.createCollection(collectionName, index, geoIndex);
  }
  throw new Error('No credentials for database');
};

export const createOrClearCollection = async (collectionName: string, index, geoIndex) => {
  if (config.postgresUser && config.postgresPassword && config.postgresDb) {
    return postgis.clearOrCreateTable(collectionName);
  }
  if (config.mongoUri) {
    await mongoDb.deleteAllFromCollection(collectionName);
    return mongoDb.createCollection(collectionName, index, geoIndex);
  }
  throw new Error('No credentials for database');
};

export const checkIfCollectionExists = async (collectionName: string) => {
  if (config.postgresUser && config.postgresPassword && config.postgresDb) {
    return postgis.checkIfTableExists(collectionName);
  }
  if (config.mongoUri) {
    return mongoDb.checkIfCollectionExists(collectionName);
  }
  throw new Error('No credentials for database');
};

export default {
  initializeDb,
  disconnectFromDB,
  clearCollection,
  createCollection,
  createOrClearCollection,
  checkIfCollectionExists,
};
