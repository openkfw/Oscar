const logger = require('./src/config/winston');
const uploads = require('./src/index');
const setupAzure = require('./src/azureStorage/azureStorageSetup');
const { initializeDb, disconnectFromDB } = require('./src/database/index');

const main = async () => {
  try {
    await initializeDb();

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
