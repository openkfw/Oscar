const azureStorage = require('azure-storage');
const axios = require('axios');

const config = require('../config/config');
const logger = require('../config/winston');

const blobService = azureStorage.createBlobService(config.azureStorageConnectionString);

const createBlobContainer = (containerName) => {
  logger.info(`Creating blob container: ${containerName}`);
  return new Promise((resolve, reject) => {
    blobService.createContainerIfNotExists(containerName, (error, result) => {
      if (error) {
        logger.error(`Failed to create blob container ${containerName}:\n${error}`);
        reject(error);
      } else {
        const message = result
          ? `${containerName} container was created.`
          : `${containerName} container already exists.`;
        logger.info(message);
        resolve();
      }
    });
  });
};

const storeStreamAsBlob = (stream, streamLength, containerName, blobName) => {
  return new Promise((resolve, reject) => {
    blobService.createBlockBlobFromStream(containerName, blobName, stream, streamLength, (err) => {
      if (err) {
        reject(err);
        logger.info(`Failed to save layers data file for ${blobName}:\n${err}`);
      }
      resolve();
    });
  });
};

const storeLocalFileAsBlob = (filePath, fileName, containerName) => {
  return new Promise((resolve, reject) => {
    blobService.createBlockBlobFromLocalFile(containerName, fileName, filePath, (err) => {
      if (err) {
        reject(err);
        logger.info(`Failed to save layers data file for ${fileName}:\n${err}`);
      }
      resolve(fileName);
    });
  });
};

const storeFromUrlAsBlob = async (sourceUrl, containerName) => {
  const result = await axios.get(sourceUrl, { responseType: 'stream' });
  if (result.status !== 200) {
    logger.error(`Failed to fetch geojson data from ${sourceUrl}`);
    return false;
  }
  const fileName = `${Date.now()}_${sourceUrl.split('/').pop()}`;
  await storeStreamAsBlob(result.data, result.headers['content-length'], containerName, fileName);
  return fileName;
};

module.exports = { createBlobContainer, storeStreamAsBlob, storeLocalFileAsBlob, storeFromUrlAsBlob };
