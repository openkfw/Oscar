import axios from 'axios';

import config from '../config';

/**
 * Function for fetching data from KOBO API
 * @param  {string} url - url address of KOBO instance
 * @param  {string} assetId - id of specific survey
 * @param  {string} date - date from last data stored to database
 */
const requestSender = async (url, assetId, date) => {
  if (!config.KOBOConnectionString) {
    throw Error('Connection string is missing, unable to fetch data.');
  }
  let urlAddress = `${url}/api/v2/assets/${assetId}/data.json`;
  if (date) {
    urlAddress = `${urlAddress}?query={"end": {"$gt": "${date}"}}`;
  }
  const headers = {
    Authorization: `Token ${config.KOBOConnectionString}`,
    Accept: 'application/json',
  };
  try {
    const response = await axios.get(urlAddress, {
      headers,
    });
    return response.data.results;
  } catch (err) {
    throw Error(err);
  }
};

export default requestSender;
