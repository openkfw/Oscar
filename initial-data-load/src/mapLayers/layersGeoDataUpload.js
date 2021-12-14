const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const axios = require('axios');
const logger = require('../config/winston');

const { getOneLayerGeoData, saveLayerGeoData, storeGeoFeaturesData, createGeoDataIndex, deleteAllFromCollection } = require('./db');
const { saveGeoJsonFromUrlSourceToStorage, saveGeoJsonFromFileToStorage } = require('./storage');

const storeGeoDataToDb = async (fromFile, data, filePath) => {
  let geojsonData;
  await deleteAllFromCollection(data.collectionName);
  if (fromFile) {
    geojsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } else {
    const result = await axios.get(data.geoDataUrl, { responseType: 'json' });
    if (result.status !== 200) {
      logger.error(`Failed to fetch geojson data from ${data.geoDataUrl}`);
      return false;
    }
    geojsonData = result.data;
  }
  await createGeoDataIndex(data.collectionName);
  await storeGeoFeaturesData(geojsonData.features, data.collectionName);
};

const formatLayerGeoData = async (data, country) => {
  const existing = await getOneLayerGeoData(data.referenceId);
  if (existing) {
    logger.info(`Layer ${data.name} already exists. Skipping...`);
    return false;
  }
  let url;
  if (data.geoDataUrl) {
    logger.info(`Downloading geojson ${data.geoDataUrl} for layer ${data.referenceId}...`);
    if (data.storeToDb) {
      await storeGeoDataToDb(false, data, null);
      url = data.apiUrl;
      logger.info(`Layer ${data.name} has new URL for geodata: ${url}`);
    } else {
      const filename = await saveGeoJsonFromUrlSourceToStorage(data.geoDataUrl);
      if (filename) {
        url = `/api/uploads/geojsons/${filename}`;
        logger.info(`Layer ${data.name} has new URL for geojson: ${url}`);
      }
    }
  } else if (data.geoDataFilename) {
    const filePath = path.join(__dirname, '..', '..', 'data', country, 'geoData', data.geoDataFilename);
    const hasFile = fs.existsSync(filePath);
    if (hasFile && data.storeToDb) {
      logger.info(`Storing geodata ${data.geoDataFilename} for layer ${data.referenceId} from file...`);
      await storeGeoDataToDb(true, data, filePath);
      url = data.apiUrl;
      logger.info(`Layer ${data.name} has new URL for geodata: ${url}`);
    } else if (hasFile && !data.storeToDb) {
      logger.info(`Storing geojson ${data.geoDataFilename} for layer ${data.referenceId} from file...`);
      const filename = await saveGeoJsonFromFileToStorage(filePath, data.geoDataFilename);
      if (filename) {
        url = `/api/uploads/geojsons/${filename}`;
        logger.info(`Layer ${data.name} has new URL for geojson: ${url}`);
      }
    } else {
      logger.info(`Layer ${data.name} has corrupted or missing geojson file.`);
    }
  }
  const newDataObj = { ...data, geoDataUrl: url, updateDate: Date.now() };
  return newDataObj;
};

const geoDataUpload = async (country) => {
  if (country) {
    let hasFile = false;
    try {
      hasFile = fs.existsSync(path.join(__dirname, '..', '..', 'data', country, 'GeoData.yml'));
    } catch (err) {
      logger.error(`GeoData for country ${country} not found:\n${err}`);
    }
    if (hasFile) {
      const layersGeoData = await yaml.load(
        fs.readFileSync(path.join(__dirname, '..', '..', 'data', country, 'GeoData.yml'), 'utf8'),
      );
      const savingGeoJsons = layersGeoData.map((item) => formatLayerGeoData(item, country));
      let geoDataForDb = await Promise.all([...savingGeoJsons]);
      geoDataForDb = geoDataForDb.filter((item) => item);
      await saveLayerGeoData(geoDataForDb);
      logger.info(`LayerGeoData for country ${country} successfully saved to database.`);
    } else {
      logger.error(`Data for country ${country} not found.`);
    }
  } else {
    logger.info('Layer geo data upload: No country for data upload specified.');
  }
};
module.exports = geoDataUpload;
