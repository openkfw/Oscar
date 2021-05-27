const azureStorage = require('azure-storage');
const config = require('../config/config');
const APIError = require('../helpers/APIError');
const logger = require('../config/winston');

const blobService = azureStorage.createBlobService(config.azureStorageConnectionString);
const { azureStorageLayerContainerName } = config;

const downloadBlobToResponse = (containerName, fileName, response) =>
  new Promise((resolve, reject) => {
    blobService.getBlobProperties(containerName, fileName, (err, blobInfo) => {
      if (err) {
        logger.error(`Could not find document in storage: ${azureStorageLayerContainerName}, ${fileName}`);
        logger.error(err);
        return reject(new APIError(`Could not find document in storage`, 404, true));
      }
      response.header('content-type', blobInfo.contentSettings.contentType);
      response.header('content-disposition', `attachment; filename=${fileName}`);
      blobService.getBlobToStream(containerName, fileName, response, (blobErr) => {
        if (err) {
          logger.error(`Could not tranform document to blob stream: ${azureStorageLayerContainerName}, ${fileName}`);
          logger.error(blobErr);
          return reject(new APIError(`Could not find document in storage`, 404, true));
        }
      });
      resolve();
    });
  });

module.exports = {
  downloadBlobToResponse,
  blobService,
};
