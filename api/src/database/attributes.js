const config = require('../config/config');
const APIError = require('../helpers/APIError');
const logger = require('../config/winston');
const { DEFAULT_GET_LIMIT, DEFAULT_GET_OFFSET } = require('../constants');

const mongoDb = require('./mongoDb/models/attributeModel');

const getLatestAttributes = () => {
  if (config.mongoUri) {
    return mongoDb.getLatestAttributes;
  }
  throw new APIError('No connection string to database', 500, false);
};

const getFilteredAttributes = () => {
  if (config.mongoUri) {
    return mongoDb.getFilteredAttributes;
  }
  throw new APIError('No connection string to database', 500, false);
};

const countAttributes = () => {
  if (config.mongoUri) {
    return mongoDb.countAttributes;
  }
  throw new APIError('No connection string to database', 500, false);
};
/**
 * Get attributes from database collection
 * @param  {object} filters - object with keys for filtering
 * @param  {object} options - limit and offset for database query
 */
const getAttributes = async (filters, options) => {
  let items = [];
  let count = 0;
  if (config.mongoUri) {
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
const getAvailableDates = (attributeId) => {
  if (config.mongoUri) {
    return mongoDb.getAvailableDates(attributeId);
  }
  throw new APIError('No connection string to database', 500, false);
};

/**
 * Returns unique featureIds for data stored for given attributeId
 * @param  {string} attributeId
 */
const getUniqueFeatureIds = (attributeId) => {
  if (config.mongoUri) {
    return mongoDb.getUniqueFeatureIds(attributeId);
  }
  throw new APIError('No connection string to database', 500, false);
};

module.exports = { getAttributes, getAvailableDates, getUniqueFeatureIds };
