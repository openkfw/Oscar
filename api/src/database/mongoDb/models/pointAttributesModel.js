const mongoose = require('mongoose');
const APIError = require('../../../helpers/APIError');
const { POINT_ATTRIBUTES_COLLECTION } = require('../dbSchemas/pointAttributeSchema');
const { filterCoordinates } = require('../filters');

const getFilteredPointAttributes = async (attributeId, bottomLeft, topRight) => {
  const { connection } = mongoose;
  const { db } = connection;

  let filter = {};
  if (bottomLeft && topRight) {
    filter = filterCoordinates(filter, bottomLeft, topRight);
  }
  if (attributeId) {
    filter['properties.attributeId'] = attributeId;
  }

  const attributes = await db.collection(POINT_ATTRIBUTES_COLLECTION).find(filter).toArray();
  return attributes;
};

const getUniqueValues = async (attributeId, property) => {
  const { connection } = mongoose;
  const { db } = connection;

  if (!attributeId || !property) {
    throw new APIError('AttributeId or property missing', 400, false);
  }

  const values = await db
    .collection(POINT_ATTRIBUTES_COLLECTION)
    .aggregate([
      { $match: { 'properties.attributeId': attributeId } },
      {
        $group: {
          _id: `properties.${property}`,
        },
      },
      { $sort: { _id: 1 } },
    ])
    .toArray();
  return values.map((item) => item._id);
};

module.exports = { getFilteredPointAttributes, getUniqueValues };
