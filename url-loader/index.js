const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');

const logger = require('./src/config/winston');
const config = require('./src/config/config');

const loadDataFromUrl = require('./src');

const main = async () => {
  try {
    logger.info('Starting service');

    logger.info(`Loading api information from file ${config.urlFile}...`);

    let sources = await yaml.load(fs.readFileSync(path.join(__dirname, 'sources', config.urlFile), 'utf8'));

    if (config.onlySourceNames) {
      const onlySourcesList = config.onlySourceNames.split(',');
      sources = sources.filter((source) => onlySourcesList.includes(source.name));
    }
    if (config.exceptSourceNames) {
      const exceptSourcesList = config.exceptSourceNames.split(',');
      sources = sources.filter((source) => !exceptSourcesList.includes(source.name));
    }
    if (!sources.length) {
      logger.error('No sources left after filtering, check source yaml file and set restrictions');
      return;
    }

    await loadDataFromUrl(sources);
    logger.info(`Data from ${config.urlFile} stored in storage.`);
  } catch (error) {
    logger.error(error);
  }
};

if (!module.parent) {
  main();
}
