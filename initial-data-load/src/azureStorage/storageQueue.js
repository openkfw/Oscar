const { QueueServiceClient } = require('@azure/storage-queue');
const logger = require('../config/winston');
const config = require('../config/config');

const queueServiceClient = QueueServiceClient.fromConnectionString(config.azureStorageConnectionString);

const createStorageQueue = async (queueName) => {
  logger.info(`Creating storage queue: ${queueName}`);
  try {
    const queueClient = queueServiceClient.getQueueClient(queueName);
    await queueClient.create();
  } catch (err) {
    logger.info(`Storage queue ${queueName} already exists.\n${err}`);
  }
};

module.exports = { createStorageQueue };
