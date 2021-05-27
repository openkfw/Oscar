const logger = require('./src/config/winston');
const uploads = require('./src/index');
const setupAzure = require('./src/azureStorage/azureStorageSetup');
const { initializeDBConnection, disconnectFromDB } = require('./src/db');

const main = async () => {
  try {
    await initializeDBConnection();

    await setupAzure();

    await uploads();

    logger.info('Successfully uploaded all initial data.');
  } catch (error) {
    logger.error(`Initial data upload failed with:\n${error}`);
  } finally {
    await disconnectFromDB();
  }
};

if (!module.parent) {
  main();
}
