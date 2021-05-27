const logger = require('../config/winston');
const mapLayersUpload = require('./mapLayersUpload');
const geoDataUpload = require('./layersGeoDataUpload');
const { createIndex } = require('./db');

module.exports = async (country) => {
  await createIndex();
  logger.info('Uploading geo data for map layers...');
  await geoDataUpload(country);

  logger.info('Uploading map layers data...');
  await mapLayersUpload(country);
};
