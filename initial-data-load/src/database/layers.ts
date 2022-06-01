/* eslint-disable import/no-named-as-default-member */
import config from '../config/config';
import logger from '../config/winston';
import { GeoDataConfigItem, MapLayerConfigItem } from '../types';
import mongoDb from './mongoDb/layers';
import postgis from './postgis/layers';

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

export const saveGeoData = (data: Array<GeoDataConfigItem>) => {
  if (config.postgresUser && config.postgresPassword && config.postgresDb) {
    return postgis.saveLayerGeoData(data);
  }
  if (config.mongoUri) {
    return mongoDb.saveGeoData(data);
  }
  throw new Error('No credentials for database');
};

export const getOneLayerGeoData = (referenceId: string) => {
  if (config.postgresUser && config.postgresPassword && config.postgresDb) {
    return postgis.getOneLayerGeoData(referenceId);
  }
  if (config.mongoUri) {
    return mongoDb.getOneLayerGeoData(referenceId);
  }
  throw new Error('No credentials for database');
};

export const saveMapLayers = (layersData: Array<MapLayerConfigItem>) => {
  if (config.postgresUser && config.postgresPassword && config.postgresDb) {
    return postgis.saveMapLayers(layersData);
  }
  if (config.mongoUri) {
    return mongoDb.saveMapLayers(layersData);
  }
  throw new Error('No credentials for database');
};

export const getOneMapLayer = (referenceId: string) => {
  if (config.postgresUser && config.postgresPassword && config.postgresDb) {
    return postgis.getOneMapLayer(referenceId);
  }
  if (config.mongoUri) {
    return mongoDb.getOneMapLayer(referenceId);
  }
  throw new Error('No credentials for database');
};
