const config = require('../config/config');
const mongoDb = require('./mongoDb/attributes');

const setupCollections = () => {
  if (config.mongoUri) {
    return mongoDb.setupCollections();
  }
  throw new Error('No connection string to database');
};

const saveAttributes = (data) => {
  if (config.mongoUri) {
    return mongoDb.saveAttributes(data);
  }
  throw new Error('No connection string to database');
};

module.exports = { setupCollections, saveAttributes };
