import config from '../config/config';
import logger from '../config/winston';
import { APIRegionAttribute } from '../types';
import mongoDb from './mongoDb/attributes';
import postgis from './postgis/attributes';

/**
 * Initial setup required for database
 */
export const setupCollections = () => {
  if (config.postgresUser && config.postgresPassword && config.postgresDb) {
    logger.info(`Tables for postgresql database are already set.`);
    return;
  }
  if (config.mongoUri) {
    return mongoDb.setupCollections();
  }
  throw new Error('No credentials for database');
};

/**
 * Save region attributes in collection
 * @param  {Array<APIRegionAttribute>} data
 */
export const saveAttributes = (data: Array<APIRegionAttribute>) => {
  if (config.postgresUser && config.postgresPassword && config.postgresDb) {
    return postgis.saveAttributes(data);
  }
  if (config.mongoUri) {
    return mongoDb.saveAttributes(data);
  }
  throw new Error('No credentials for database');
};
