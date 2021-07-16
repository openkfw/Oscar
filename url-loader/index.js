const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');
const Bottleneck = require('bottleneck');

const logger = require('./src/config/winston');
const config = require('./src/config/config');

const storeFile = require('./src/storeFile');
const reloadQueries = require('./src/reloadQueries');

const limiter = new Bottleneck({
  minTime: config.bottleneckTimeLimit,
  maxConcurrent: config.bottleneckMaxConcurrent,
});

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

    const reloadRequests = [];
    const allRequests = sources
      .map((source) => {
        const newSource = { url: source.url, credentials: source.credentials };
        return source.data.map((request) => {
          if (request.reloadCheck && request.reloadCheck.length) {
            reloadRequests.push({ ...newSource, request });
            return false;
          }
          return { ...newSource, request };
        });
      })
      .flat()
      .filter((item) => item);
    logger.info(`Fetching ${allRequests.length} regular requests and ${reloadRequests.length} queries will be checked`);
    let needsReload = [];
    if (reloadRequests.length) {
      const foundReloads = reloadRequests.map((request) => reloadQueries(request));
      needsReload = await Promise.all(foundReloads);
      needsReload = needsReload.flat().filter((item) => item);
    }

    const allTasks = [...needsReload, ...allRequests].map((req) =>
      limiter.schedule(() => storeFile(req.url, req.request, req.credentials)),
    );
    await Promise.all(allTasks);

    logger.info(`Data from ${config.urlFile} stored in storage.`);
  } catch (error) {
    logger.error(error);
  }
};

if (!module.parent) {
  main();
}
