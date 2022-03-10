const { createBlobContainer } = require('./blobContainer');
const { createStorageQueue } = require('./storageQueue');
const config = require('../config/config');
const logger = require('../config/winston');
/**
 * creates azure storage containers and queues from lists from env variables NEW_STORAGE_CONTAINERS and NEW_STORAGE_QUEUES
 */
const setupAzureStorage = async () => {
  logger.info('Generating azure storage structures...');
  if (config.newStorageContainers) {
    const containerNames = config.newStorageContainers.split(',');
    if (containerNames && containerNames.length) {
      const containers = containerNames.map((containerName) => createBlobContainer(containerName));
      await Promise.all(containers);
    }
  }

  if (config.newStorageQueues) {
    const queueNames = config.newStorageQueues.split(',');
    if (queueNames && queueNames.length) {
      const queues = queueNames.map((queueName) => createStorageQueue(queueName));
      await Promise.all(queues);
    }
  }
};
module.exports = setupAzureStorage;
