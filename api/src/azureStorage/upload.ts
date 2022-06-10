import azureStorage from 'azure-storage';
import config from '../config/config';
import APIError from '../helpers/APIError';
import logger from '../config/winston';

export const blobService = azureStorage.createBlobService(config.azureStorageConnectionString);
export const { azureStorageLayerContainerName } = config;

export const downloadBlobToResponse = (containerName: string, fileName: string, response): Promise<void> =>
  new Promise((resolve, reject) => {
    blobService.getBlobProperties(containerName, fileName, (err, blobInfo) => {
      if (err) {
        logger.error(`Could not find document in storage: ${azureStorageLayerContainerName}, ${fileName}`);
        logger.error(err);
        return reject(new APIError(`Could not find document in storage`, 404, true, undefined));
      }
      response.header('content-type', blobInfo.contentSettings.contentType);
      response.header('content-disposition', `attachment; filename=${fileName}`);
      blobService.getBlobToStream(containerName, fileName, response, (blobErr) => {
        if (err) {
          logger.error(`Could not transform document to blob stream: ${azureStorageLayerContainerName}, ${fileName}`);
          logger.error(blobErr);
          return reject(new APIError(`Could not find document in storage`, 404, true, undefined));
        }
      });
      resolve();
    });
  });

export default {
  downloadBlobToResponse,
  blobService,
};
