import config from '../config/config';
import APIError from '../helpers/APIError';
import logger from '../config/winston';
import { DEFAULT_GET_LIMIT, DEFAULT_GET_OFFSET } from '../constants';

import mongoDb from './mongoDb/models/attributeModel';
import postgis from './postgis/models/attributeModel';

export const getLatestAttributes = () => {
  if (config.postgresUser && config.postgresPassword && config.postgresDb) {
    return postgis.getLatestAttributes;
  }
  if (config.mongoUri) {
    return mongoDb.getLatestAttributes;
  }
  throw new APIError('No credentials for database', 500, false, undefined);
};

export const getFilteredAttributes = () => {
  if (config.postgresUser && config.postgresPassword && config.postgresDb) {
    return postgis.getFilteredAttributes;
  }
  if (config.mongoUri) {
    return mongoDb.getFilteredAttributes;
  }
  throw new APIError('No credentials for database', 500, false, undefined);
};

export const countAttributes = () => {
  if (config.postgresUser && config.postgresPassword && config.postgresDb) {
    return postgis.countAttributes;
  }
  if (config.mongoUri) {
    return mongoDb.countAttributes;
  }
  throw new APIError('No credentials for database', 500, false, undefined);
};
/**
 * Get attributes from database collection
 * @param  {object} filters - object with keys for filtering
 * @param  {object} options - limit and offset for database query
 */
export const getAttributes = async (filters, options) => {
  let items: object | typeof logger.error = {};
  let count: number | void = 0;
  if (config.mongoUri || (config.postgresUser && config.postgresPassword && config.postgresDb)) {
    if (!(filters.attributeIds || filters.attributeIdCategories)) {
      throw new APIError('Failed to fetch data. Missing attributeIdCategories and attributeId.', 500, true, undefined);
    }
    if (filters.latestValues) {
      items = await getLatestAttributes()(filters.attributeId, filters.attributeIdCategory, filters.featureId).catch(
        (e) => logger.error(`Error: ${e.message}`),
      );
    } else {
      const dataLimit = Number.parseInt(options.limit, 10) || DEFAULT_GET_LIMIT;
      const dataOffset = Number.parseInt(options.offset, 10) || DEFAULT_GET_OFFSET;
      count = await countAttributes()(
        filters.attributeId,
        filters.attributeIdCategory,
        filters.featureId,
        filters.dateStart,
        filters.dateEnd,
      );
      items = await getFilteredAttributes()(
        filters.attributeId,
        filters.attributeIdCategory,
        filters.featureId,
        filters.dateStart,
        filters.dateEnd,
        dataLimit,
        dataOffset,
      ).catch((e) => logger.error(`Error: ${e.message}`));
    }
  }
  return { items, count };
};

/**
 * Returns all dates with data for given attributeId
 * @param  {string} attributeId
 */
export const getAvailableDates = (attributeId: string) => {
  if (config.postgresUser && config.postgresPassword && config.postgresDb) {
    return postgis.getAvailableDates(attributeId);
  }
  if (config.mongoUri) {
    return mongoDb.getAvailableDates(attributeId);
  }
  throw new APIError('No credentials for database', 500, false, undefined);
};

/**
 * Returns unique featureIds for data stored for given attributeId
 * @param  {string} attributeId
 */
export const getUniqueFeatureIds = (attributeId: string) => {
  if (config.postgresUser && config.postgresPassword && config.postgresDb) {
    return postgis.getUniqueFeatureIds(attributeId);
  }
  if (config.mongoUri) {
    return mongoDb.getUniqueFeatureIds(attributeId);
  }
  throw new APIError('No credentials for database', 500, false, undefined);
};

export default { getAttributes, getAvailableDates, getUniqueFeatureIds };
