import mongoose from 'mongoose';
import APIError from '../../../helpers/APIError';
import { ATTRIBUTES_COLLECTION_NAME } from '../dbSchemas/attributeSchema';
import { dateIsValid } from '../../../helpers/utils';
import { Filter } from '../../../types';

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
  const filter: Filter = {};

  if (attributeIds || attributeIdCategories) {
    let attributeIdsArray = [];
    let attributeCategoryArray = [];
    if (attributeIds) {
      attributeIdsArray = Array.isArray(attributeIds) ? attributeIds : [attributeIds];
      filter.attributeId = { $in: attributeIdsArray };
    }
    if (attributeIdCategories) {
      attributeCategoryArray = Array.isArray(attributeIdCategories)
        ? attributeIdCategories
        : attributeIdCategories.split('');
      attributeCategoryArray = attributeCategoryArray.map((attributeString) => new RegExp(`^${attributeString}`));
    }
    filter.attributeId = { $in: [...attributeIdsArray, ...attributeCategoryArray] };
  }
  if (featureIds) {
    filter.featureId = { $in: featureIds };
  }

  if (dateStart && dateEnd) {
    if (dateIsValid(dateStart) && dateIsValid(dateEnd)) {
      if (!(new Date(dateStart) <= new Date(dateEnd))) {
        throw new APIError('Invalid date format: Start date is greater than end date', 400, true, undefined);
      }
      filter.date = { $gte: dateStart, $lte: dateEnd };
    } else {
      throw new APIError('Invalid date format', 400, true, undefined);
    }
  } else if (dateStart) {
    if (!dateIsValid(dateStart)) {
      throw new APIError('Invalid date format', 400, true, undefined);
    }
    filter.date = { $gte: dateStart };
  } else if (dateEnd) {
    if (!dateIsValid(dateEnd)) {
      throw new APIError('Invalid date format', 400, true, undefined);
    }
    filter.date = { $lte: dateEnd };
  }

  return filter;
};

/**
 * Reorder returned attributes in object with attribute Ids as keys
 * @param  {array} attributes - array with objects returned from database
 */
const reorderAttributesByAttributeId = (attributes) => {
  const attributesByAttributeId = {};
  attributes.forEach((att) => {
    attributesByAttributeId[att._id] = att.features.map((ft) => ({
      date: ft.date,
      dataDate: ft.dataDate,
      featureId: ft.featureId,
      attributeId: ft.attributeId,
      value: ft.valueNumber || ft.valueNumber === 0 ? ft.valueNumber : ft.valueString,
    }));
  });
  return attributesByAttributeId;
};

/**
 * Gets attributes from database with given filter
 * @param  {object} filter - filter for find query in mongoose
 * @param  {number} limit - limit how many items should be returned
 * @param  {number} offset - number from which start the returned part
 */
const getAttributes = async (filter, limit, offset) => {
  const { connection } = mongoose;
  const { db } = connection;

  const attributes = await db
    .collection(ATTRIBUTES_COLLECTION_NAME)
    .aggregate([
      { $match: filter },
      {
        $sort: { date: 1, featureId: 1, attributeId: 1 },
      },
      { $skip: offset },
      { $limit: limit },
      {
        $group: {
          _id: '$attributeId',
          attributeId: { $first: '$attributeId' },
          features: {
            $push: {
              date: '$date',
              dataDate: '$dataDate',
              featureId: '$featureId',
              attributeId: '$attributeId',
              valueNumber: '$valueNumber',
              valueString: '$valueString',
            },
          },
        },
      },
    ])
    .toArray();
  return reorderAttributesByAttributeId(attributes);
};

/**
 * Get filtered attributes from database
 * @param  {array} attributeIds - ids of attributes
 * @param  {array} attributeIdCategories - categories of attributes, common part of attributeId for regex search
 * @param  {array} featureIds - geographical features only to be selected
 * @param  {string} dateStart - ISOString to take attributes from
 * @param  {string} dateEnd - ISOString to take attributes until
 */
const getFilteredAttributes = async (
  attributeIds,
  attributeIdCategories,
  featureIds,
  dateStart,
  dateEnd,
  limit,
  offset,
) =>
  getAttributes(
    createAttributesFilter(attributeIds, attributeIdCategories, featureIds, dateStart, dateEnd),
    limit,
    offset,
  );

/**
 * @param  {array} attributeIds - ids of attributes
 * @param  {array} attributeIdCategories - categories of attributes, common part of attributeId for regex search
 * @param  {array} featureIds - geographical features only to be selected
 */
const getLatestAttributes = async (attributeIds, attributeIdCategories, featureIds) => {
  if (!(attributeIds || attributeIdCategories)) {
    throw new APIError('Failed to fetch data. Missing attributeIdCategories and attributeId.', 500, true, undefined);
  }
  const { connection } = mongoose;
  const { db } = connection;

  const match = createAttributesFilter(attributeIds, attributeIdCategories, featureIds, undefined, undefined);

  const attributes = await db
    .collection(ATTRIBUTES_COLLECTION_NAME)
    .aggregate([
      { $match: match },
      {
        $sort: { date: -1, featureId: 1, attributeId: 1 },
      },
      {
        $group: {
          _id: { featureId: '$featureId', attributeId: '$attributeId' },
          dataDate: { $first: '$dataDate' },
          date: { $first: '$date' },
          featureId: { $first: '$featureId' },
          attributeId: { $first: '$attributeId' },
          valueNumber: { $first: '$valueNumber' },
          valueString: { $first: '$valueString' },
        },
      },
      {
        $group: {
          _id: '$_id.attributeId',
          attributeId: { $first: '$_id.attributeId' },
          features: {
            $push: {
              dataDate: '$dataDate',
              date: '$date',
              featureId: '$featureId',
              attributeId: '$attributeId',
              valueNumber: '$valueNumber',
              valueString: '$valueString',
            },
          },
        },
      },
    ])
    .toArray();

  return reorderAttributesByAttributeId(attributes);
};

/**
 * Counts all documents found for given filtering conditions.
 * @param  {object} filter - mongoose format of find query
 */
const getDocumentsCount = async (filter) => {
  const { connection } = mongoose;
  const { db } = connection;

  const count = await db.collection(ATTRIBUTES_COLLECTION_NAME).countDocuments(filter);

  return count;
};
/**
 * Gets all unique dates for given attributeId
 * @param  {string} attributeId
 */
const getAvailableDates = async (attributeId) => {
  const { connection } = mongoose;
  const { db } = connection;

  const dates = await db
    .collection(ATTRIBUTES_COLLECTION_NAME)
    .aggregate([
      { $match: { attributeId } },
      {
        $group: {
          _id: '$date',
          dataDate: { $first: '$dataDate' },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ])
    .toArray();
  return dates.map((date) => ({
    dataDate: date.dataDate,
    date: date._id,
  }));
};

/**
 * Gets all unique featureIds for given attributeId
 * @param  {string} attributeId
 */
const getUniqueFeatureIds = async (attributeId) => {
  const { connection } = mongoose;
  const { db } = connection;

  const items = await db
    .collection(ATTRIBUTES_COLLECTION_NAME)
    .aggregate([
      { $match: { attributeId } },
      {
        $group: {
          _id: '$featureId',
        },
      },
      {
        $sort: { _id: 1 },
      },
    ])
    .toArray();
  return items.map((item) => item._id);
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
  getDocumentsCount(createAttributesFilter(attributeIds, attributeIdCategories, featureIds, dateStart, dateEnd));

export default {
  getFilteredAttributes,
  getLatestAttributes,
  getAvailableDates,
  getUniqueFeatureIds,
  countAttributes,
};
