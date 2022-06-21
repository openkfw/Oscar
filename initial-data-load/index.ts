import logger from './src/config/winston';
import uploads from './src/index';
import setupAzure from './src/azureStorage/azureStorageSetup';
import { initializeDb, disconnectFromDB } from './src/database';
import config from './src/config/config';

const main = async () => {
  try {
    logger.info(`Loading data for dataset ${config.dataset || config.country}`);

    await initializeDb();

    await setupAzure();

    await uploads();

    logger.info('Successfully uploaded all initial data.');
  } catch (error) {
    logger.error(`Initial data upload failed with:\n${error}`);
  } finally {
    await disconnectFromDB();
    process.exit();
  }
};

if (!module.parent) {
  main();
}
