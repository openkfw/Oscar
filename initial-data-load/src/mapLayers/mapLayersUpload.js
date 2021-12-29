const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const logger = require('../config/winston');
const { getOneLayerGeoData, saveMapLayers } = require('./db');

const addMapLayer = async (data) => {
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
    attributeTemplateName: data.attributeTemplateName,
    featureId: data.featureId,
    metadata: data.metadata,
    style: data.style,
    legend: data.legend,
    layerOptions: data.layerOptions,
  };
};

const uploadMapLayers = async (country) => {
  if (country) {
    const filePath = path.join(__dirname, '..', '..', 'data', country, 'MapLayers.yml');
    const hasFile = fs.existsSync(filePath);
    if (hasFile) {
      const mapLayers = await yaml.load(fs.readFileSync(filePath, 'utf8'));
      const checkedAndPreparedData = mapLayers.map((layer) => addMapLayer(layer));
      const dataForDb = await Promise.all([...checkedAndPreparedData]);
      const singleMapData = dataForDb.filter((item) => item && item.layerType !== 'group');
      const groupMapData = dataForDb.filter((item) => item && item.layerType === 'group');
      await saveMapLayers(singleMapData, groupMapData);
    } else {
      logger.error(`Data for country ${country} not found.`);
    }
  } else {
    logger.info('Map layer upload: No country for data upload specified.');
  }

  logger.info('Finished map layers loading.');
};

module.exports = uploadMapLayers;
