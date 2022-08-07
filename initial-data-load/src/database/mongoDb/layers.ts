import logger from '../../config/winston';

import { createRegularIndex, createGeoDataIndex, bulkStoreToDb } from '.';
import { MAP_LAYER_COLLECTION_NAME, MapLayer } from './schemas/mapLayersSchema';
import LayerGeoDataSchema from './schemas/layerGeoDataSchema';
import { MapLayerConfigItem, MongoDbMapLayer } from '../../types';

export const createIndexes = async () => {
  await createRegularIndex(MAP_LAYER_COLLECTION_NAME, { title: 1 });
  await createGeoDataIndex(MAP_LAYER_COLLECTION_NAME);
};

// geoData collection
export const saveGeoData = async (data) => LayerGeoDataSchema.insertMany(data);
export const getOneLayerGeoData = (referenceId) => LayerGeoDataSchema.findOne({ referenceId });

// mapLayers collection
const oneMapLayerItem = async (data: MapLayerConfigItem) => {
  if (data.layerType === 'group') {
    const updatedLayers = await Promise.all([
      ...data.layers.map(async (layer) => {
        const geoData = await getOneLayerGeoData(layer.geoReferenceId);
        if (geoData) {
          return layer;
        }
        const newLayer = { ...layer, geoReferenceId: undefined };
        return newLayer;
      }),
    ]);
    logger.info(`Saved mapLayer with layerType ${data.layerType} and referenceId ${data.referenceId}.`);
    return {
      referenceId: data.referenceId,
      geoReferenceId: data.geoReferenceId,
      layerType: data.layerType,
      category: data.category,
      title: data.title,
      attribute: data.attribute,
      attributeDescription: data.attributeDescription,
      attributeTemplateName: data.attributeTemplateName,
      featureId: data.featureId,
      metadata: data.metadata,
      layers: updatedLayers,
      layerOptions: data.layerOptions,
    };
  }
  if (data.geoReferenceId) {
    const geoData = await getOneLayerGeoData(data.geoReferenceId);
    if (!geoData) {
      logger.error(`Geo data for ${data.referenceId} by id ${data.geoReferenceId} not found.`);
      return false;
    }
  }
  return {
    referenceId: data.referenceId,
    geoReferenceId: data.geoReferenceId,
    layerType: data.layerType,
    category: data.category,
    title: data.title,
    attribute: data.attribute,
    attributeDescription: data.attributeDescription,
    attributeData: data.attributeData,
    attributeTemplateName: data.attributeTemplateName,
    featureId: data.featureId,
    metadata: data.metadata,
    style: data.style,
    legend: data.legend,
    layerOptions: data.layerOptions,
  };
};

export const saveMapLayers = async (mapLayers: Array<MapLayerConfigItem>) => {
  const checkedAndPreparedData = mapLayers.map((layer) => oneMapLayerItem(layer));
  const layerDataResults = await Promise.all([...checkedAndPreparedData]);

  const temp: any = layerDataResults.filter((item) => item);
  const layerData: Array<MongoDbMapLayer> = temp;

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

export const getOneMapLayer = (referenceId) => MapLayer.findOne({ referenceId });

export const setupCollections = createIndexes;
export default {
  createIndexes,
  saveGeoData,
  getOneLayerGeoData,
  saveMapLayers,
  getOneMapLayer,
  setupCollections: createIndexes,
};
