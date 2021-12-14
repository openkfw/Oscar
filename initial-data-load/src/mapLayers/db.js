const mongoose = require('mongoose');
const LayerGeoDataSchema = require('./layerGeoDataSchema');
const { MapLayer } = require('./mapLayersSchema');
const logger = require('../config/winston');
const { GeoFeaturesSchema } = require('./geoFeaturesSchema');

const { MAP_LAYER_COLLECTION_NAME } = require('./mapLayersSchema');

const createIndex = async () => {
  await mongoose.connection.db.collection('mapLayers').createIndex({ title: 1 });
};

const createGeoDataIndex = async (collectionName) => {
  await mongoose.connection.db.collection(collectionName).createIndex({ geometry: '2dsphere' });
};

const deleteAllFromCollection = async (collectionName) => {
  await mongoose.connection.db.collection(collectionName).remove({});
};

const saveLayerGeoData = (data) => LayerGeoDataSchema.insertMany(data);

const getOneLayerGeoData = (referenceId) => LayerGeoDataSchema.findOne({ referenceId });

const getOneMapLayer = (referenceId) => MapLayer.findOne({ referenceId });

const saveMapLayers = async (singleMapLayers, groupMapLayers) => {
  const singleMapLayersOperations = [];
  const groupMapLayersOperations = [];

  singleMapLayers.forEach((layer) => {
    singleMapLayersOperations.push({
      updateOne: {
        filter: { referenceId: layer.referenceId },
        update: {
          $set: layer,
        },
        upsert: true,
      },
    });
    logger.info(
      `Single map layer ${layer.referenceId} will be inserted/updated in collection ${MAP_LAYER_COLLECTION_NAME}`,
    );
  });

  groupMapLayers.forEach((layer) => {
    groupMapLayersOperations.push({
      updateOne: {
        filter: { referenceId: layer.referenceId },
        update: {
          $set: layer,
        },
        upsert: true,
      },
    });
    logger.info(
      `Group map layer ${layer.referenceId} will be inserted/updated in collection ${MAP_LAYER_COLLECTION_NAME}.`,
    );
  });

  const { connection } = mongoose;
  const { db } = connection;

  if (singleMapLayersOperations.length) {
    await db.collection(MAP_LAYER_COLLECTION_NAME).bulkWrite(singleMapLayersOperations, { ordered: false });
    logger.info(`Single map layers successfully stored to collection.`);
  }
  if (groupMapLayersOperations.length) {
    await db.collection(MAP_LAYER_COLLECTION_NAME).bulkWrite(groupMapLayersOperations, { ordered: false });
    logger.info(`Group map layers successfully stored to collection.`);
  }
  if (!singleMapLayersOperations.length && !groupMapLayersOperations.length) {
    logger.info(`No data to upload in map layers json file`);
  }
};

const storeGeoFeaturesData = (data, collectionName) => {
  const GeoFeatureModel = mongoose.model('GeoFeature', GeoFeaturesSchema, collectionName);
  return GeoFeatureModel.insertMany(data);
};

module.exports = {
  createIndex,
  createGeoDataIndex,
  saveLayerGeoData,
  getOneLayerGeoData,
  saveMapLayers,
  getOneMapLayer,
  storeGeoFeaturesData,
  deleteAllFromCollection,
};
