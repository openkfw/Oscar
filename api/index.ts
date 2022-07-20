import appInsights from 'applicationinsights';
import config from './src/config/config';
import logger from './src/config/winston';
import { initializeDb } from './src/database';
import app from './src/config/express';

if (config.appInsightsInstrumentationKey) {
  appInsights.setup().start();
}

const startApp = async () => {
  try {
    await initializeDb();

    app.listen(config.port, () => {
      logger.info(`Oscar API running and listening on port ${config.port}`);
    });
  } catch (err) {
    logger.error(err);
  }
};

if (!module.parent) {
  startApp();
}