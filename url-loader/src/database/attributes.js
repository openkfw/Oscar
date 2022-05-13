const { ATTRIBUTES_COLLECTION_NAME } = require('./constants');
const config = require('../config/config');

const mongoDb = require('./mongoDb');
const mongoDbAttributes = require('./mongoDb/attributes');

const setupCollectionForAttributes = () => {
  if (config.mongoUri) {
    return mongoDb.createCollection(ATTRIBUTES_COLLECTION_NAME, { date: -1 });
  }
  throw new Error('No credentials for database');
};

const getLatestAttributeDate = (attributeId) => {
  if (config.mongoUri) {
    return mongoDbAttributes.getLatestAttributeDate(attributeId);
  }
  throw new Error('No credentials for database');
};

module.exports = { setupCollectionForAttributes, getLatestAttributeDate };
