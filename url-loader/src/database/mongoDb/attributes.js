const mongoose = require('mongoose');

const { ATTRIBUTES_COLLECTION_NAME } = require('../constants');

/**
 * Find latest date for data for given attributeId
 * @param  {string} attributeId
 */
const getLatestAttributeDate = async (attributeId) => {
  const { connection } = mongoose;
  const { db } = connection;

  const date = await db
    .collection(ATTRIBUTES_COLLECTION_NAME)
    .find({ attributeId })
    .sort({ date: -1 })
    .limit(1)
    .toArray();
  if (date.length) {
    return date[0].date;
  }
};

module.exports = { getLatestAttributeDate };
