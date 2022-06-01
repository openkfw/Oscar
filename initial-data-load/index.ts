import logger from './src/config/winston';
import uploads from './src/index';
import setupAzure from './src/azureStorage/azureStorageSetup';
import { initializeDb, disconnectFromDB } from './src/database';

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
