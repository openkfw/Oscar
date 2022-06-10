const logger = require('../../config/winston');

const { createRegularIndex, createGeoDataIndex, bulkStoreToDb } = require('.');
const { MAP_LAYER_COLLECTION_NAME, MapLayer } = require('./schemas/mapLayersSchema');
const LayerGeoDataSchema = require('./schemas/layerGeoDataSchema');

const createIndexes = async () => {
  await createRegularIndex(MAP_LAYER_COLLECTION_NAME, { title: 1 });
  await createGeoDataIndex(MAP_LAYER_COLLECTION_NAME);
};

// geoData collection
const saveGeoData = async (data) => LayerGeoDataSchema.insertMany(data);
const getOneLayerGeoData = (referenceId) => LayerGeoDataSchema.findOne({ referenceId });

// mapLayers collection
const saveMapLayers = async (layerData) => {
  const operations = layerData.map((layer) => ({
    updateOne: {
      filter: { referenceId: layer.referenceId },
      update: {
        $set: layer,
      },
      upsert: true,
    },
  }));

  if (operations && operations.length) {
    await bulkStoreToDb(MAP_LAYER_COLLECTION_NAME, operations, { bulkSize: 20 });
    logger.info(`Successfully stored ${operations.length} items to collection ${MAP_LAYER_COLLECTION_NAME}.`);
  } else {
    logger.info(`No items to store in collection ${MAP_LAYER_COLLECTION_NAME}`);
  }
};

const getOneMapLayer = (referenceId) => MapLayer.findOne({ referenceId });

module.exports = {
  createIndexes,
  saveGeoData,
  getOneLayerGeoData,
  saveMapLayers,
  getOneMapLayer,
  setupCollections: createIndexes,
};
