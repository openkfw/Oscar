import Bottleneck from 'bottleneck';

import logger from './config/winston';
import config from './config/config';
import reloadQueries from './reloadQueries';
import storeFile from './storeFile';

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

export default loadDataFromUrl;
