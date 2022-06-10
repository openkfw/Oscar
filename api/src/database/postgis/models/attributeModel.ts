import { getDb } from '../index';
import { REGION_ATTRIBUTES_TABLE } from '../constants';
import { dateIsValid } from '../../../helpers/utils';
import { PostgreFilter } from '../../../types';
import APIError from '../../../helpers/APIError';

/**
 * Compose filter from settings from query
 * @param  {Array<string>} attributeIds - ids of attributes
 * @param  {any} attributeIdCategories - categories of attributes, common part of attributeId for regex search
 * @param  {Array<string>} featureIds - geographical features only to be selected
 * @param  {string} dateStart - ISOString to take attributes from
 * @param  {string} dateEnd - ISOString to take attributes until
 */
const createAttributesFilter = (
  attributeIds: Array<string>,
  attributeIdCategories: any,
  featureIds: Array<string>,
  dateStart: string,
  dateEnd: string,
) => {
  const filter: PostgreFilter = {};

  if (attributeIds || attributeIdCategories) {
    let attributeIdsArray = [];
    let attributeCategoryArray = [];
    if (attributeIds) {
      attributeIdsArray = Array.isArray(attributeIds) ? attributeIds : [attributeIds];
      filter.attributeId = attributeIdsArray;
    }
    if (attributeIdCategories) {
      attributeCategoryArray = Array.isArray(attributeIdCategories)
        ? attributeIdCategories
        : attributeIdCategories.split('');
      attributeCategoryArray = attributeCategoryArray.map((attributeString) => new RegExp(`^${attributeString}`));
    }
    filter.attributeId = [...attributeIdsArray, ...attributeCategoryArray];
  }
  if (featureIds) {
    filter.featureId = featureIds;
  }

  if (dateStart && dateEnd) {
    if (dateIsValid(dateStart) && dateIsValid(dateEnd)) {
      if (!(new Date(dateStart) <= new Date(dateEnd))) {
        throw new APIError('Invalid date format: Start date is greater than end date', 400, true, undefined);
      }
      filter.dateStart = dateStart;
      filter.dateEnd = dateEnd;
    } else {
      throw new APIError('Invalid date format', 400, true, undefined);
    }
  } else if (dateStart) {
    if (!dateIsValid(dateStart)) {
      throw new APIError('Invalid date format', 400, true, undefined);
    }
    filter.dateStart = dateStart;
  } else if (dateEnd) {
    if (!dateIsValid(dateEnd)) {
      throw new APIError('Invalid date format', 400, true, undefined);
    }
    filter.dateEnd = dateEnd;
  }

  return filter;
};

const getAttributesFilterConditions = (filter, qb) => {
  if (filter.attributeId) {
    qb.where(`${REGION_ATTRIBUTES_TABLE}.attribute_id`, 'in', filter.attributeId);
  }

  if (filter.featureId) {
    qb.andWhere(`${REGION_ATTRIBUTES_TABLE}.feature_id`, 'in', filter.featureId);
  }

  if (filter.dateStart) {
    qb.andWhere(`${REGION_ATTRIBUTES_TABLE}.date_iso`, '>', filter.dateStart);
  }

  if (filter.dateEnd) {
    qb.andWhere(`${REGION_ATTRIBUTES_TABLE}.date_iso`, '<', filter.dateEnd);
  }
};

// const getFilteredAttributesRows = (filter, db = getDb()) =>
//   db.from(REGION_ATTRIBUTES_TABLE).where((qb) => {
//     getAttributesFilterConditions(filter, qb);
//   });

/**
 * Counts all documents found for given filtering conditions.
 * @param  {object} filter - mongoose format of find query
 */
const getFilteredAttributesCount = async (filter, db = getDb()) => {
  const count = db
    .from(REGION_ATTRIBUTES_TABLE)
    .count('*')
    .filter()
    .where((qb) => {
      getAttributesFilterConditions(filter, qb);
    });
  return count;
};

/**
 * Gets all unique dates for given attributeId
 * @param  {string} attributeId
 * @param  {Knex} db - knex connection
 */
const getAvailableDates = async (attributeId, db = getDb()) => {
  await db
    .from(REGION_ATTRIBUTES_TABLE)
    .where('attributeId', attributeId)
    .select('date_iso', 'date_data')
    .distinct('date_iso', 'date_data')
    .orderBy('date_iso');
};

/**
 * Gets all unique featureIds for given attributeId
 * @param  {string} attributeId
 * @param  {Knex} db - knex connection
 */
const getUniqueFeatureIds = async (attributeId, db = getDb()) => {
  await db
    .from(REGION_ATTRIBUTES_TABLE)
    .where('attribute_id', attributeId)
    .select('feature_id')
    .distinct('feature_id')
    .orderBy('feature_id');
};

/**
 * Get count of all attributes by given values
 * @param  {array} attributeIds - ids of attributes
 * @param  {array} attributeIdCategories - categories of attributes, common part of attributeId for regex search
 * @param  {array} featureIds - geographical features only to be selected
 * @param  {string} dateStart - ISOString to take attributes from
 * @param  {string} dateEnd - ISOString to take attributes until
 */
const countAttributes = (attributeIds, attributeIdCategories, featureIds, dateStart, dateEnd) =>
  getFilteredAttributesCount(
    createAttributesFilter(attributeIds, attributeIdCategories, featureIds, dateStart, dateEnd),
  );

export default { getAvailableDates, getUniqueFeatureIds, countAttributes };
