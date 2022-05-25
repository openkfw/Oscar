import { QueueServiceClient } from '@azure/storage-queue';
import logger from '../config/winston';
import config from '../config/config';

const queueServiceClient = QueueServiceClient.fromConnectionString(config.azureStorageConnectionString);

const createStorageQueue = async (queueName: string) => {
  logger.info(`Creating storage queue: ${queueName}`);
  try {
    const queueClient = queueServiceClient.getQueueClient(queueName);
    await queueClient.create();
  } catch (err) {
    logger.info(`Storage queue ${queueName} already exists.\n${err}`);
  }
};

export default createStorageQueue;
