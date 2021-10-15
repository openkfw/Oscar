const mongoose = require('mongoose');
const config = require('./config/config');
const logger = require('./config/winston');

const initializeDBConnection = async () => {
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
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: config.dbName,
  });
  logger.info('DB Connection successful');
};

const disconnectFromDB = async () => {
  await mongoose.disconnect();
  logger.info('Disconnected from DB successfully');
};

const removeDB = async () => {
  await mongoose.deleteModel(/.+/);
  await mongoose.connection.dropDatabase();
  logger.info('DB dropped successfully');
};

module.exports = {
  initializeDBConnection,
  disconnectFromDB,
  removeDB,
};
