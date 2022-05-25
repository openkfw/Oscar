/* eslint-disable import/no-named-as-default-member */
import config from '../config/config';
import logger from '../config/winston';
import { MapLayerConfigItem } from '../types';
import mongoDb from './mongoDb/layers';
import postgis from './postgis/layers';

export const setupCollections = () => {
  if (config.postgresUser && config.postgresPassword && config.postgresDb) {
    logger.info(`Tables for postgresql database are already set.`);
  }
  if (config.mongoUri) {
    return mongoDb.setupCollections();
  }
  throw new Error('No credentials for database');
};

