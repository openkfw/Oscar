import azureStorage from 'azure-storage';
import axios from 'axios';

import config from '../config/config';
import logger from '../config/winston';

const blobService = azureStorage.createBlobService(config.azureStorageConnectionString);

export const createBlobContainer = (containerName: string): Promise<void> => {
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

export const storeStreamAsBlob = (stream, streamLength, containerName, blobName): Promise<void> => {
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

export const storeLocalFileAsBlob = (filePath: string, fileName: string, containerName: string): Promise<string> => {
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

export const storeFromUrlAsBlob = async (sourceUrl: string, containerName: string) => {
  const result = await axios.get(sourceUrl, { responseType: 'stream' });
  if (result.status !== 200) {
    logger.error(`Failed to fetch geojson data from ${sourceUrl}`);
    return false;
  }
  const fileName = `${Date.now()}_${sourceUrl.split('/').pop()}`;
  await storeStreamAsBlob(result.data, result.headers['content-length'], containerName, fileName);
  return fileName;
};
