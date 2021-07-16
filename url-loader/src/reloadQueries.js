const logger = require('./config/winston');
const { initializeDBConnection, disconnectFromDB, getLatestAttributeDate, createIndexes } = require('./db');
const { getDatesFrom, dateObjectToISODate } = require('./utils');

const isDateYesterday = (date) => {
  const dateObject = new Date(date);
  const oneDay = 1000 * 60 * 60 * 26; // day and two hours to check, if data was successfully stored in last days
  const today = new Date(Date.now());
  today.setHours(0, 0, 0, 0);
  return dateObject.getTime() >= today.getTime() - oneDay;
};

const reloadQueries = async (requestQuery) => {
  const { request } = requestQuery;
  logger.info(`Searching for latest data for query ${request.name}`);
  await initializeDBConnection();
  await createIndexes();
  try {
    // check last date for data in collection
    const numberOfChecks = request.reloadCheck.length;
    let lastData = false;
    let i = 0;
    while (!lastData && i < numberOfChecks) {
      // eslint-disable-next-line
      const lastDate = await getLatestAttributeDate(request.reloadCheck[i]);
      if (!isDateYesterday(lastDate)) {
        lastData = lastDate;
      }
      i += 1;
    }
    if (lastData === false) {
      // all data are up to date, no reloading
      logger.info(`Data from ${request.name} are up to date.`);
      return;
    }
    if (lastData === undefined) {
      // no data in database for check attributes, loading week from yesterday
      lastData = dateObjectToISODate(new Date(Date.now() - 1000 * 60 * 60 * 24 * 8));
      logger.info(`No data in database for ${request.name}, loading data for last week.`);
    } else {
      // found just old data for an attribute
      logger.info(`Found data from ${lastData} for ${request.name}`);
    }
    // get array with dates
    const datesToFetch = getDatesFrom(lastData);
    // create queries in format for fetching and storing data
    return datesToFetch.map((date) => ({
      url: requestQuery.url,
      credentials: requestQuery.credentials,
      request: { ...request, date },
    }));
  } catch (err) {
    logger.error(err);
  } finally {
    await disconnectFromDB();
  }
};

module.exports = reloadQueries;
