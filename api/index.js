const appInsights = require('applicationinsights');
const config = require('./src/config/config');
const logger = require('./src/config/winston');
const { initializeDb } = require('./src/database');

if (config.appInsightsInstrumentationKey) {
  appInsights.setup().start();
}
const app = require('./src/config/express');

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
