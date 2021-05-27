const azureStorage = require('azure-storage');

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

module.exports = createBlobContainer;
