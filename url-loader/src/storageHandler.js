const azureStorage = require('azure-storage');
const config = require('./config/config');
const logger = require('./config/winston');

const blobService = azureStorage.createBlobService(config.azureStorageConnectionString);
const { azureStorageRawDataContainerName } = config;

/**
 * Generates name for blob save to storage, in case the file should be stored in specific folder, it combines folder name with file name
 * @param  {string} fileName - Name for saved file
 * @param  {string} folderName - Folder to save the file into
 */
const getBlobName = (fileName, folderName) => (folderName ? `${folderName}/${fileName}` : fileName);

/**
 * Stores stream as blob in azure storage
 * @param  {} stream - the stream to be stored
 * @param  {number} streamLength - length of incoming stream
 * @param  {string} fileName - fileName of new blob in storage
 * @param  {string} folderName - folder to save the file into
 */
const sendStreamAsBlob = (stream, streamLength, fileName, folderName) => {
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
const sendTextAsBlob = (text, fileName, folderName) => {
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

module.exports = {
  sendStreamAsBlob,
  sendTextAsBlob,
  blobService,
};
