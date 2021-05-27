const azureStorage = require('azure-storage');
const axios = require('axios');

const config = require('../config/config');
const logger = require('../config/winston');

const blobService = azureStorage.createBlobService(config.azureStorageConnectionString);
const { azureStorageLayerContainerName } = config;

const sendLayerFileAsBlob = (stream, streamLength, blobName) => {
  return new Promise((resolve, reject) => {
    blobService.createBlockBlobFromStream(azureStorageLayerContainerName, blobName, stream, streamLength, (err) => {
      if (err) {
        reject(err);
        logger.info(`Failed to save layers data file for ${blobName}:\n${err}`);
      }
      resolve();
    });
  });
};

const saveGeoJsonFromFileToStorage = async (filePath, fileName) => {
  return new Promise((resolve, reject) => {
    blobService.createBlockBlobFromLocalFile(azureStorageLayerContainerName, fileName, filePath, (err) => {
      if (err) {
        reject(err);
        logger.info(`Failed to save layers data file for ${fileName}:\n${err}`);
      }
      resolve(fileName);
    });
  });
};

const saveGeoJsonFromUrlSourceToStorage = async (sourceUrl) => {
  const result = await axios.get(sourceUrl, { responseType: 'stream' });
  if (result.status !== 200) {
    logger.error(`Failed to fetch geojson data from ${sourceUrl}`);
    return false;
  }
  const filename = `${Date.now()}_${sourceUrl.split('/').pop()}`;
  await sendLayerFileAsBlob(result.data, result.headers['content-length'], filename);
  return filename;
};

module.exports = { saveGeoJsonFromUrlSourceToStorage, saveGeoJsonFromFileToStorage };
