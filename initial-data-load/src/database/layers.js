const config = require('../config/config');
const mongoDb = require('./mongoDb/layers');

const setupCollections = () => {
  if (config.mongoUri) {
    return mongoDb.setupCollections();
  }
  throw new Error('No connection string to database');
};

const saveGeoData = (data) => {
  if (config.mongoUri) {
    return mongoDb.saveGeoData(data);
  }
  throw new Error('No connection string to database');
};

const getOneLayerGeoData = (referenceId) => {
  if (config.mongoUri) {
    return mongoDb.getOneLayerGeoData(referenceId);
  }
  throw new Error('No connection string to database');
};

const saveMapLayers = (layersData) => {
  if (config.mongoUri) {
    return mongoDb.saveMapLayers(layersData);
  }
  throw new Error('No connection string to database');
};

const getOneMapLayer = (referenceId) => {
  if (config.mongoUri) {
    return mongoDb.getOneMapLayer(referenceId);
  }
  throw new Error('No connection string to database');
};

module.exports = { setupCollections, saveGeoData, getOneLayerGeoData, saveMapLayers, getOneMapLayer };
