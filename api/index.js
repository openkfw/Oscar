const appInsights = require('applicationinsights');
const config = require('./src/config/config');
const logger = require('./src/config/winston');
const { initializeDBConnection } = require('./src/db');

if (config.appInsightsInstrumentationKey) {
  appInsights.setup().start();
}
const app = require('./src/config/express');

const startApp = async () => {
  try {
    await initializeDBConnection();

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
