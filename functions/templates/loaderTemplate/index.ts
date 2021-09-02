import { AzureFunction, Context } from '@azure/functions';
import dataParser from './components/dataParser';
import fileLoader from './components/fileLoader';
import { initializeDBConnection, storeToDb } from './db';
import { ATTRIBUTES_COLLECTION } from './constants';

/**
 * Function triggered by new file in blob storage container (folderName/{filename}).
 * Loading data from file in azure storage blob container
 * Processing data from file.
 * Storing data in database collection in correct format.
 * @param {object} context - Azure function's context (e.g. for metadata, logging)
 * @param {buffer} incomingBlob - blob storage content
 */
const templateLoader: AzureFunction = async (context: Context, incomingBlob: Buffer): Promise<void> => {
  // load data from file
  // TODO: open components/fileLoader.ts and add your code for processing your file format
  const dataFromFile = fileLoader(incomingBlob);
  if (!dataFromFile) {
    context.log(`No data for processing found in file ${context.bindingData.filename}`);
    return;
  }
  context.log(`Data from file ${context.bindingData.filename} loaded, connecting to database...`);
  await initializeDBConnection(context);

  context.log('Database connection initialized. Processing data...');
  // process loaded data and convert them into Attribute format
  // TODO: open components/dataParser.ts and add your code for transforming data
  const dataToStore = dataParser(dataFromFile);

  // store data to database
  if (!dataToStore || !dataToStore.length) {
    context.log('No data for storing into database.');
  }
  await storeToDb(ATTRIBUTES_COLLECTION, dataToStore);

  context.log('Import to database successfully finished.');
};

export default templateLoader;
