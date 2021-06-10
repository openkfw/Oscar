const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const logger = require('../config/winston');

const { getOneLayerGeoData, saveLayerGeoData } = require('./db');
const { saveGeoJsonFromUrlSourceToStorage, saveGeoJsonFromFileToStorage } = require('./storage');

const formatLayerGeoData = async (data, country) => {
  const existing = await getOneLayerGeoData(data.referenceId);
  if (existing) {
    logger.info(`Layer ${data.name} already exists. Skipping...`);
    return false;
  }
  let url;
  if (data.geoJSONUrl) {
    logger.info(`Downloading geojson ${data.geoJSONUrl} for layer ${data.referenceId}...`);
    const filename = await saveGeoJsonFromUrlSourceToStorage(data.geoJSONUrl);
    if (filename) {
      url = `/api/uploads/geojsons/${filename}`;
      logger.info(`Layer ${data.name} has new URL for geojson: ${url}`);
    }
  } else if (data.geoJSONFilename) {
    const filePath = path.join(__dirname, '..', '..', 'data', country, 'geoData', data.geoJSONFilename);
    const hasFile = fs.existsSync(filePath);
    if (hasFile) {
      logger.info(`Storing geojson ${data.geoJSONFilename} for layer ${data.referenceId} from file...`);
      const filename = await saveGeoJsonFromFileToStorage(filePath, data.geoJSONFilename);
      if (filename) {
        url = `/api/uploads/geojsons/${filename}`;
        logger.info(`Layer ${data.name} has new URL for geojson: ${url}`);
      }
    } else {
      logger.info(`Layer ${data.name} has corrupted or missing geojson file.`);
    }
  }
  const newDataObj = { ...data, geoJSONUrl: url, updateDate: Date.now() };
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