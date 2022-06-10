import { ATTRIBUTES_COLLECTION } from '../constants';
import { getLastDate, storeToDb } from '../db';
import requestSender from './requestSender';
import dataParser from './dataParser';

const surveyHandler = async (survey, context) => {
  try {
    // find last fetched data
    const lastDate = await getLastDate(ATTRIBUTES_COLLECTION, survey.name);
    if (lastDate) {
      context.log(`Fetching new data since ${lastDate}`);
    }

    // fetch data from API
    const responseData = await requestSender(survey.url, survey.assetId, lastDate);

    if (!responseData || !responseData.length) {
      context.log(`No data returned for survey ${survey.assetId}.`);
      return;
    }

    context.log('Data from API fetched, processing data...');
    // process data and convert them into Attribute format
    const dataToStore = dataParser(responseData, survey);

    // store data to database
    if (!dataToStore || !dataToStore.length) {
      context.log('No data for storing into database.');
      return;
    }
    await storeToDb(ATTRIBUTES_COLLECTION, dataToStore);

    context.log(`Import to database successfully finished. ${dataToStore.length} document(s) created or updated.`);

    return true;
  } catch (err) {
    context.log.error(err);
    return false;
  }
};

export default surveyHandler;
