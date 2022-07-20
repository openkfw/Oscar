import azureStorage from 'azure-storage';
import config from './config/config';
import logger from './config/winston';

export const blobService = azureStorage.createBlobService(config.azureStorageConnectionString);
const { azureStorageRawDataContainerName } = config;

/**
 * Generates name for blob save to storage, in case the file should be stored in specific folder, it combines folder name with file name
 * @param  {string} fileName - Name for saved file
 * @param  {string} folderName - Folder to save the file into
 */
const getBlobName = (fileName: string, folderName: string): string =>
  folderName ? `${folderName}/${fileName}` : fileName;

/**
 * Stores stream as blob in azure storage
 * @param  {} stream - the stream to be stored
 * @param  {number} streamLength - length of incoming stream
 * @param  {string} fileName - fileName of new blob in storage
 * @param  {string} folderName - folder to save the file into
 */
export const sendStreamAsBlob = (stream, streamLength, fileName, folderName): Promise<void> => {
  const blobName = getBlobName(fileName, folderName);
  return new Promise((resolve, reject) => {
    blobService.createBlockBlobFromStream(azureStorageRawDataContainerName, blobName, stream, streamLength, (err) => {
      if (err) {
        logger.error(`Failed to save file ${blobName}: ${err}`);
        reject(err);
      }
      resolve();
    });
  });
};

/**
 * @param  {string} text - stringified JSON or any text data
 * @param  {string} fileName - fileName of new blob in storage
 * @param  {string} folderName - folder to save the file into
 */
export const sendTextAsBlob = (text: string, fileName: string, folderName: string): Promise<void> => {
  const blobName = getBlobName(fileName, folderName);
  return new Promise((resolve, reject) => {
    blobService.createBlockBlobFromText(azureStorageRawDataContainerName, blobName, text, (err) => {
      if (err) {
        logger.error(`Failed to save text file ${blobName}: ${err}`);
        reject(err);
      }
      resolve();
    });
  });
};
