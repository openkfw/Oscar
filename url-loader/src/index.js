const Bottleneck = require('bottleneck');

const logger = require('./config/winston');
const config = require('./config/config');
const reloadQueries = require('./reloadQueries');
const storeFile = require('./storeFile');

const limiter = new Bottleneck({
  minTime: config.bottleneckTimeLimit,
  maxConcurrent: config.bottleneckMaxConcurrent,
});

const loadDataFromUrl = async (sources) => {
  const errors = [];

  try {
    const reloadRequests = [];
    const singleRequests = sources
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
    logger.info(
      `Fetching ${singleRequests.length} regular requests and ${reloadRequests.length} queries will be checked`,
    );
    let needsReload = [];
    if (reloadRequests.length) {
      const foundReloads = reloadRequests.map((request) => reloadQueries(request));
      needsReload = await Promise.all(foundReloads);
      needsReload = needsReload.flat().filter((item) => item);
    }

    const allTasks = [...needsReload, ...singleRequests].map((req) =>
      limiter.schedule(() => storeFile(req.url, req.request, req.credentials)),
    );
    await Promise.all(allTasks);
  } catch (error) {
    errors.push(error);
  }
};

module.exports = loadDataFromUrl;
