import { Knex } from 'knex';
import { getDb } from '../index';
import { FEATURE_ATTRIBUTES_TABLE } from '../constants';
import { dateIsValid } from '../../../helpers/utils';
import { AttributeFilter, FeatureAttribute, FeatureAttributeReordered, AvailableDate } from '../../../types';
import APIError from '../../../helpers/APIError';

/**
 * Compose filter from settings from query
 * @param  {Array<string>} attributeIds - ids of feature attributes
 * @param  {any} attributeIdCategories - categories of feature attributes, common part of attributeId for regex search
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
): AttributeFilter => {
  const filter: AttributeFilter = {};

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
      attributeCategoryArray = attributeCategoryArray.map((attributeString) => `${attributeString}%`);
      filter.attributeIdCategory = attributeCategoryArray;
    }
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

/**
 * Reorder returned feature attributes in object with attribute Ids as keys
 * @param  {Array<FeatureAttribute>} attributes - array with objects returned from database
 */
const reorderAttributesByAttributeId = (attributes: Array<FeatureAttribute>): FeatureAttributeReordered => {
  const attributesByAttributeId = {};
  attributes.forEach((att) => {
    attributesByAttributeId[att.attributeId] = att.features.map((ft) => ({
      ...ft,
      // default valueType in db is String
      value: ft.valueType === 'Number' ? parseInt(ft.value, 10) : ft.value,
    }));
  });
  return attributesByAttributeId;
};

/**
 * Create specific conditions with the filter, that retrieved rows needs to match
 * @param  {AttributeFilter} filter - filter composed from settings from query
 * @param  {Knex.QueryBuilder} qb
 */
const getAttributesFilterConditions = (filter: AttributeFilter, qb: Knex.QueryBuilder): void => {
  if (filter.attributeId) {
    qb.where(`${FEATURE_ATTRIBUTES_TABLE}.attribute_id`, 'in', filter.attributeId);
  }

  if (filter.attributeIdCategory) {
    filter.attributeIdCategory.forEach((attributeIdCategory) =>
      qb.orWhere(`${FEATURE_ATTRIBUTES_TABLE}.attribute_id`, 'like', attributeIdCategory),
    );
  }

  if (filter.featureId) {
    qb.andWhere(`${FEATURE_ATTRIBUTES_TABLE}.feature_id`, 'in', filter.featureId);
  }

  if (filter.dateStart) {
    qb.andWhere(`${FEATURE_ATTRIBUTES_TABLE}.date_iso`, '>=', filter.dateStart);
  }

  if (filter.dateEnd) {
    qb.andWhere(`${FEATURE_ATTRIBUTES_TABLE}.date_iso`, '<=', filter.dateEnd);
  }
};

/**
 * Gets feature attributes from database with given filter
 * @param  {AttributeFilter} filter - filter composed from settings from query
 * @param  {number} limit - limit how many items should be returned
 * @param  {number} offset - number from which start the returned part
 * @param  {Knex} db - knex connection
 */
const getAttributes = async (
  filter: AttributeFilter,
  limit: number,
  offset: number,
  db = getDb(),
): Promise<FeatureAttributeReordered> => {
  const attributes = await db
    .select([
      'attribute_id as attributeId',
      getDb().raw(
        `JSON_AGG(JSON_BUILD_OBJECT('attributeId', attribute_id, 'featureId', feature_id, 'featureIdLvl', feature_id_lvl, 'value', value, 'valueType', value_type,
         'date', date_iso, 'dataDate', date_data, 'createdAt', created_at, 'updatedAt', updated_at)) AS features`,
      ),
    ])
    .from(
      getDb()
        .select('*')
        .from(FEATURE_ATTRIBUTES_TABLE)
        .where((qb) => {
          getAttributesFilterConditions(filter, qb);
        })
        .orderBy([{ column: 'date_iso' }, { column: 'feature_id' }, { column: 'attribute_id' }])
        .limit(limit)
        .offset(offset)
        .as('processedTable'),
    )
    .groupBy('attribute_id');

  return reorderAttributesByAttributeId(attributes);
};

/**
 * Get filtered feature attributes from database
 * @param  {Array<string>} attributeIds - ids of feature attributes
 * @param  {any} attributeIdCategories - categories of feature attributes, common part of attributeId for regex search
 * @param  {Array<string>} featureIds - geographical features only to be selected
 * @param  {string} dateStart - ISOString to take attributes from
 * @param  {string} dateEnd - ISOString to take attributes until
 * @param  {number} limit - limit how many items should be returned
 * @param  {number} offset - number from which start the returned part
 */
const getFilteredAttributes = async (
  attributeIds: Array<string>,
  attributeIdCategories: any,
  featureIds: Array<string>,
  dateStart: string,
  dateEnd: string,
  limit: number,
  offset: number,
): Promise<FeatureAttributeReordered> =>
  getAttributes(
    createAttributesFilter(attributeIds, attributeIdCategories, featureIds, dateStart, dateEnd),
    limit,
    offset,
  );

/**
 * @param  {Array<string>} attributeIds - ids of feature attributes
 * @param  {any} attributeIdCategories - categories of feature attributes, common part of attributeId for regex search
 * @param  {Array<string>} featureIds - geographical features only to be selected
 * @param  {Knex} db - knex connection
 */
const getLatestAttributes = async (
  attributeIds: Array<string>,
  attributeIdCategories: any,
  featureIds: Array<string>,
  db = getDb(),
): Promise<FeatureAttributeReordered> => {
  if (!(attributeIds || attributeIdCategories)) {
    throw new APIError('Failed to fetch data. Missing attributeIdCategories and attributeId.', 500, true, undefined);
  }

  const filter = createAttributesFilter(attributeIds, attributeIdCategories, featureIds, undefined, undefined);

  const attributes = await db
    .select([
      'attribute_id as attributeId',
      getDb().raw(
        `JSON_AGG(JSON_BUILD_OBJECT('attributeId', attribute_id, 'featureId', feature_id, 'featureIdLvl', feature_id_lvl, 'value', value, 'valueType', value_type,
         'date', date_iso, 'dataDate', date_data, 'createdAt', created_at, 'updatedAt', updated_at)) AS features`,
      ),
    ])
    .from(
      getDb()
        .select('*')
        .distinctOn('attribute_id', 'feature_id')
        .from(FEATURE_ATTRIBUTES_TABLE)
        .where((qb) => {
          getAttributesFilterConditions(filter, qb);
        })
        .orderBy([{ column: 'attribute_id' }, { column: 'feature_id' }, { column: 'date_iso', order: 'desc' }])
        .as('processed_table'),
    )
    .groupBy('attribute_id');

  return reorderAttributesByAttributeId(attributes);
};

/**
 * Counts all rows found for given filtering conditions.
 * @param  {AttributeFilter} filter - filter composed from settings from query
 * @param  {Knex} db - knex connection
 */
const getFilteredAttributesCount = async (filter: AttributeFilter, db = getDb()): Promise<number> => {
  const count = await db
    .from(FEATURE_ATTRIBUTES_TABLE)
    .count('*')
    .where((qb) => {
      getAttributesFilterConditions(filter, qb);
    });
  return count[0].count;
};

/**
 * Gets all unique dates for given attributeId
 * @param  {string} attributeId
 * @param  {Knex} db - knex connection
 */
const getAvailableDates = async (attributeId: string, db = getDb()): Promise<Array<AvailableDate>> => {
  const dates = await db
    .from(FEATURE_ATTRIBUTES_TABLE)
    .where('attribute_id', attributeId)
    .select('date_iso as date', 'date_data as dataDate')
    .distinct('date_iso', 'date_data')
    .orderBy('date_iso');
  return dates.map((date) => ({
    dataDate: date.dataDate,
    date: date.date,
  }));
};

/**
 * Gets all unique featureIds for given attributeId
 * @param  {string} attributeId
 * @param  {Knex} db - knex connection
 */
const getUniqueFeatureIds = async (attributeId: string, db = getDb()): Promise<Array<string>> => {
  const items = await db
    .from(FEATURE_ATTRIBUTES_TABLE)
    .where('attribute_id', attributeId)
    .select('feature_id')
    .distinct('feature_id')
    .orderBy('feature_id');

  return items.map((item) => item.feature_id);
};

/**
 * Get count of all feature attributes by given values
 *
 * @param  {Array<string>} attributeIds - ids of feature attributes
 * @param  {any} attributeIdCategories - categories of feature attributes, common part of attributeId for regex search
 * @param  {Array<string>} featureIds - geographical features only to be selected
 * @param  {string} dateStart - ISOString to take attributes from
 * @param  {string} dateEnd - ISOString to take attributes until
 */
const countAttributes = (
  attributeIds: Array<string>,
  attributeIdCategories: any,
  featureIds: Array<string>,
  dateStart: string,
  dateEnd: string,
): Promise<number> => {
  return getFilteredAttributesCount(
    createAttributesFilter(attributeIds, attributeIdCategories, featureIds, dateStart, dateEnd),
  );
};

export default { getFilteredAttributes, getLatestAttributes, getAvailableDates, getUniqueFeatureIds, countAttributes };
