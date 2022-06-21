/* eslint-disable import/no-named-as-default-member */
import { ATTRIBUTES_COLLECTION_NAME } from './mongoDb/constants';
import config from '../config/config';
import logger from '../config/winston';

import mongoDb from './mongoDb';
import mongoDbAttributes from './mongoDb/attributes';
import postgisAttributes from './postgis/attributes';

export const setupCollectionForAttributes = () => {
  if (config.postgresUser && config.postgresPassword && config.postgresDb) {
    logger.info('Table is already initialized in database.');
    return;
  }
  if (config.mongoUri) {
    return mongoDb.createCollection(ATTRIBUTES_COLLECTION_NAME, { date: -1 });
  }
  throw new Error('No credentials for database');
};

export const getLatestAttributeDate = (attributeId) => {
  if (config.postgresUser && config.postgresPassword && config.postgresDb) {
    return postgisAttributes.getLatestAttributeDate(attributeId);
  }
  if (config.mongoUri) {
    return mongoDbAttributes.getLatestAttributeDate(attributeId);
  }
  throw new Error('No credentials for database');
};
