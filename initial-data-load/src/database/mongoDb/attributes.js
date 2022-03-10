const mongoose = require('mongoose');
const logger = require('../../config/winston');

const { createRegularIndex, createGeoDataIndex } = require('.');
const { ATTRIBUTES_COLLECTION_NAME, POINT_ATTRIBUTES_COLLECTION_NAME } = require('./constants');

const createIndexesForAttributesCollections = async () => {
  await createRegularIndex(ATTRIBUTES_COLLECTION_NAME, { date: -1, featureId: 1, attributeId: 1 });
  await createRegularIndex(ATTRIBUTES_COLLECTION_NAME, { date: 1, featureId: 1, attributeId: 1 });
  await createRegularIndex(ATTRIBUTES_COLLECTION_NAME, { date: -1 });
  await createGeoDataIndex(POINT_ATTRIBUTES_COLLECTION_NAME);
  await createRegularIndex(POINT_ATTRIBUTES_COLLECTION_NAME, { 'properties.attributeId': 1 });
  await createRegularIndex(POINT_ATTRIBUTES_COLLECTION_NAME, { 'properties.updatedDate': -1 });
};

const saveAttributes = async (data) => {
  const operations = data.map((itemData) => ({
    replaceOne: {
      filter: {
        date: itemData.date,
        featureId: itemData.featureId,
        attributeId: itemData.attributeId,
      },
      replacement: itemData,
      upsert: true,
    },
  }));
  if (operations.length) {
    await mongoose.connection.db.collection(ATTRIBUTES_COLLECTION_NAME).bulkWrite(operations, { strict: false });
  } else {
    logger.info(`No values in stored.`);
  }
};

module.exports = { setupCollections: createIndexesForAttributesCollections, saveAttributes };
