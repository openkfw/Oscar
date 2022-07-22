import mongoose from 'mongoose';
import APIError from '../../../helpers/APIError';
import { POINT_ATTRIBUTES_COLLECTION } from '../dbSchemas/pointAttributeSchema';
import { filterCoordinates } from '../filters';
import { dateIsValidDatum } from '../../../helpers/utils';

const getFilteredPointAttributes = async (attributeId, bottomLeft, topRight, dateStart, dateEnd) => {
  const { connection } = mongoose;
  const { db } = connection;

  let filter = {};
  if (bottomLeft && topRight) {
    filter = filterCoordinates(filter, bottomLeft, topRight);
  }
  if (attributeId) {
    filter['properties.attributeId'] = attributeId;
  }

  // date filters
  if (dateStart && dateEnd) {
    if (dateIsValidDatum(dateStart) && dateIsValidDatum(dateEnd)) {
      if (!(new Date(dateStart) <= new Date(dateEnd))) {
        throw new APIError('Invalid date format: Start date is greater than end date', 400, true, undefined);
      }
      filter['properties.date'] = { $gte: dateStart, $lte: dateEnd };
    } else {
      throw new APIError('Invalid date format', 400, true, undefined);
    }
  } else if (dateStart) {
    if (!dateIsValidDatum(dateStart)) {
      throw new APIError('Invalid date format', 400, true, undefined);
    }
    filter['properties.date'] = { $gte: dateStart };
  } else if (dateEnd) {
    if (!dateIsValidDatum(dateEnd)) {
      throw new APIError('Invalid date format', 400, true, undefined);
    }
    filter['properties.date'] = { $lte: dateEnd };
  }

  const attributes = await db.collection(POINT_ATTRIBUTES_COLLECTION).find(filter).toArray();
  return attributes;
};

const getLastDatePointAttributes = async (attributeId, bottomLeft, topRight) => {
  const { connection } = mongoose;
  const { db } = connection;

  let filter = {};
  if (bottomLeft && topRight) {
    filter = filterCoordinates(filter, bottomLeft, topRight);
  }
  if (attributeId) {
    filter['properties.attributeId'] = attributeId;
  }

  const lastDate = await db
    .collection(POINT_ATTRIBUTES_COLLECTION)
    .find({ 'properties.attributeId': attributeId })
    .sort({ 'properties.date': -1 })
    .limit(1)
    .toArray();

  if (!lastDate || !lastDate.length) {
    throw new APIError(
      `Failed fetching last date for ${attributeId} in ${POINT_ATTRIBUTES_COLLECTION}`,
      500,
      false,
      undefined,
    );
  }

  // eslint-disable-next-line prefer-destructuring
  filter['properties.date'] = lastDate[0].properties.date;
  const pointAttributes = await db.collection(POINT_ATTRIBUTES_COLLECTION).find(filter).toArray();
  return pointAttributes;
};

const getUniqueValues = async (attributeId, property) => {
  const { connection } = mongoose;
  const { db } = connection;

  if (!attributeId || !property) {
    throw new APIError('AttributeId or property missing', 400, false, undefined);
  }

  const values = await db
    .collection(POINT_ATTRIBUTES_COLLECTION)
    .aggregate([
      { $match: { 'properties.attributeId': attributeId } },
      {
        $group: {
          _id: `$properties.${property}`,
        },
      },
      { $sort: { _id: 1 } },
    ])
    .toArray();
  return values.map((item) => item._id);
};

export default { getFilteredPointAttributes, getLastDatePointAttributes, getUniqueValues };
