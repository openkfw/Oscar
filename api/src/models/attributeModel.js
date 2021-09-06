const mongoose = require('mongoose');
const APIError = require('../helpers/APIError');
const { ATTRIBUTES_COLLECTION_NAME } = require('../dbSchemas/attributeSchema');
const { dateIsValid } = require('../helpers/utils');

/**
 * Compose filter from settings from query
 * @param  {array} attributeIds - ids of attributes
 * @param  {array} attributeIdCategories - categories of attributes, common part of attributeId for regex search
 * @param  {array} featureIds - geographical features only to be selected
 * @param  {string} dateStart - ISOString to take attributes from
 * @param  {string} dateEnd - ISOString to take attributes until
 */
const createAttributesFilter = (attributeIds, attributeIdCategories, featureIds, dateStart, dateEnd) => {
  const filter = {};

  if (attributeIds || attributeIdCategories) {
    let attributeIdsArray = [];
    let attributeCategoryArray = [];
    if (attributeIds) {
      attributeIdsArray = Array.isArray(attributeIds) ? attributeIds : attributeIds.split('');
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
        throw new APIError('Invalid date format: Start date is greater than end date', 400, true);
      }
      filter.date = { $gte: dateStart, $lte: dateEnd };
    } else {
      throw new APIError('Invalid date format', 400, true);
    }
  } else if (dateStart) {
    if (!dateIsValid(dateStart)) {
      throw new APIError('Invalid date format', 400, true);
    }
    filter.date = { $gte: dateStart };
  } else if (dateEnd) {
    if (!dateIsValid(dateEnd)) {
      throw new APIError('Invalid date format', 400, true);
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
 */
const getLatestAttributes = async (attributeIds, attributeIdCategories) => {
  if (!(attributeIds || attributeIdCategories)) {
    throw new APIError('Failed to fetch data. Missing attributeIdCategories and attributeId.', 500, true);
  }
  const { connection } = mongoose;
  const { db } = connection;

  const match = createAttributesFilter(attributeIds, attributeIdCategories);

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
  return dates.map((date) => date._id);
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

module.exports = { getFilteredAttributes, getLatestAttributes, getAvailableDates, countAttributes };
