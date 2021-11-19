const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const logger = require('../config/winston');

const { getOneLayerGeoData, saveLayerGeoData } = require('./db');
const { saveGeoDataFromUrlSourceToStorage, saveGeoDataFromFileToStorage } = require('./storage');

const formatLayerGeoData = async (data, country) => {
  const existing = await getOneLayerGeoData(data.referenceId);
  if (existing) {
    logger.info(`Layer ${data.name} already exists. Skipping...`);
    return false;
  }
  let url;
  if (data.geoDataUrl) {
    logger.info(`Downloading geodata file ${data.geoDataUrl} for layer ${data.referenceId} from url...`);
    const filename = await saveGeoDataFromUrlSourceToStorage(data.geoDataUrl);
    if (filename) {
      url = `/api/uploads/geodata/${filename}`;
      logger.info(`Layer ${data.name} has new URL for geodata file: ${url}`);
    }
  } else if (data.geoDataFilename) {
    const filePath = path.join(__dirname, '..', '..', 'data', country, 'geoData', data.geoDataFilename);
    const hasFile = fs.existsSync(filePath);
    if (hasFile) {
      logger.info(`Storing geodata file ${data.geoDataFilename} for layer ${data.referenceId} from filename...`);
      const filename = await saveGeoDataFromFileToStorage(filePath, data.geoDataFilename);
      if (filename) {
        url = `/api/uploads/geodata/${filename}`;
        logger.info(`Layer ${data.name} has new URL for geodata file: ${url}`);
      }
    } else {
      logger.info(`Layer ${data.name} has corrupted or missing geodata file.`);
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
      logger.error(`GeoData file for country ${country} not found:\n${err}`);
    }
    if (hasFile) {
      const layersGeoData = await yaml.load(
        fs.readFileSync(path.join(__dirname, '..', '..', 'data', country, 'GeoData.yml'), 'utf8'),
      );
      const savingGeoData = layersGeoData.map((item) => formatLayerGeoData(item, country));
      let geoDataForDb = await Promise.all([...savingGeoData]);
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
