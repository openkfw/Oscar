import mongoose from 'mongoose';
import config from '../../config/config';
import logger from '../../config/winston';

export const initializeDBConnection = async () => {
  logger.info(`Connecting to database`);
  if (process.env.NODE_ENV !== 'test') {
    await mongoose.set('debug', (collectionName, method, query, doc) => {
      logger.debug(`Mongoose - ${method} on collection ${collectionName} `, {
        collection: collectionName,
        method,
        query,
        stack: JSON.stringify(doc), // log content of doc at the end
      });
    });
  }
  await mongoose.connect(config.mongoUri, {
    dbName: config.dbName,
  });
  logger.info('DB Connection successful');
};

export const disconnectFromDB = async () => {
  await mongoose.disconnect();
  logger.info('Disconnected from DB successfully');
};

export const removeDB = async () => {
  await mongoose.deleteModel(/.+/);
  await mongoose.connection.dropDatabase();
  logger.info('DB dropped successfully');
};

export default {
  initializeDBConnection,
  disconnectFromDB,
  removeDB,
};
