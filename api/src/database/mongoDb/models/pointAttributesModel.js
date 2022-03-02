const mongoose = require('mongoose');
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

module.exports = { getFilteredPointAttributes };
