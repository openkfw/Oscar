const config = require('./config/config');
const logger = require('./config/winston');

const mapLayerDataUpload = require('./mapLayers');
const { uploadAttributes } = require('./attributes');

const uploads = async () => {
  if (config.uploadDataTypes.includes('mapLayers')) {
    await mapLayerDataUpload(config.country);
  }

  if (config.uploadDataTypes.includes('attributes')) {
    logger.info('Uploading sample attributes...');
    await uploadAttributes(config.country);
  }
};

module.exports = uploads;
