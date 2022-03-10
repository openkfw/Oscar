const config = require('../config/config');
const mongoDb = require('./mongoDb/geoFeatureCollections');

const storeGeoFeaturesData = (collectionName, data) => {
  if (config.mongoUri && config.mongoUri !== '') {
    return mongoDb.storeGeoFeaturesData(collectionName, data);
  }
  throw new Error('No connection string to database');
};

module.exports = { storeGeoFeaturesData };
