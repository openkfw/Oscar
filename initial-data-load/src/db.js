const mongoose = require('mongoose');
const config = require('./config/config');
const logger = require('./config/winston');

const initializeDBConnection = async () => {
  logger.info(`Connecting to database ...`);
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
    socketTimeoutMS: 200000,
    dbName: config.dbName,
  });
  logger.info('Successfully connected to database.');
};

const disconnectFromDB = async () => {
  await mongoose.disconnect();
  logger.info('Successfully disconnected from database.');
};

const removeDB = async () => {
  await mongoose.deleteModel(/.+/);
  await mongoose.connection.dropDatabase();
  logger.info('Database dropped successfully');
};

module.exports = {
  initializeDBConnection,
  disconnectFromDB,
  removeDB,
};
