const axios = require('axios');

const logger = require('./config/winston');
const config = require('./config/config');
const { sendStreamAsBlob, sendTextAsBlob } = require('./storageHandler');
const { fillInValues } = require('./utils');

const storeFile = async (url, requestData, credentials) => {
  const requestConfig = requestData.requestConfig || {};
  if (credentials && credentials.username && credentials.password) {
    requestConfig.auth = {
      username: config[credentials.username],
      password: config[credentials.password],
    };
  }
  const fullUrl = fillInValues(url + (requestData.query || ''), requestData.date);
  const parsedFilename = fillInValues(requestData.filename, requestData.date);
  logger.info(`Fetching data from ${fullUrl}`);
  let response;
  try {
    response = await axios.get(fullUrl, requestConfig);
    if (response.status !== 200) {
      logger.error(`Failed to fetch data from ${fullUrl}:\n${response.message || response.body}`);
      return;
    }
  } catch (error) {
    logger.error(`Request to ${fullUrl} failed with:\n${error}`);
    return;
  }
  try {
    if (response.headers['content-type'].includes('application/json')) {
      logger.info(`Storing file ${parsedFilename} to Azure storage.`);
      await sendTextAsBlob(JSON.stringify(response.data), parsedFilename, requestData.foldername);
      logger.info(`File ${parsedFilename} was successfully stored.`);
    } else {
      logger.info(`Storing file ${parsedFilename} to Azure storage.`);
      if (response.headers['content-length']) {
        await sendStreamAsBlob(
          response.data,
          response.headers['content-length'],
          parsedFilename,
          requestData.foldername,
        );
        logger.info(`File ${parsedFilename} was successfully stored.`);
      } else {
        logger.error(`Response for ${fullUrl} is not stream.`);
      }
    }
  } catch (error) {
    logger.error(`Failed to save data into ${parsedFilename}:\n${error}`);
  }
};

module.exports = storeFile;
