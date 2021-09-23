import { AzureFunction, Context } from '@azure/functions';
import { initializeDBConnection, getFromDb, storeToDb } from './db';
import { COLLECTION_NAME } from './constants';
import calculate from './calculation';
import { Attribute, AttributesFilter, AttributesFromDB } from './types';

/**
 * Function triggered by new message in Azure Storage Queue.
 * Getting data from database for given attributeIds and date and storing new calculated data
 * - connects to the MongoDB (creates a connection if needed)
 * - fetch data from database
 * - calculate new derived data
 * - executes bulk update with an upsert
 * @param {object} context - Azure function' context (e.g. for logging)
 */
const calculationTemplate: AzureFunction = async (context: Context): Promise<void> => {
  const dateISOString = new Date().toISOString();
  context.log(`Starting queue trigger function at ${dateISOString}`);

  // Get date from message, else now is used
  const dataDate = context.bindings.queueMessage.date || dateISOString;

  // Connect to database
  await initializeDBConnection(context);
  context.log('Database connection initialized');

  // Get values from database
  // TODO: add attributes and dates for required data
  const attributeFilters: Array<AttributesFilter> = [];
  const dataFromDatabase: Array<AttributesFromDB> = await getFromDb(attributeFilters);

  // calculations
  const calculatedAttributes: Array<Attribute> = await calculate(dataFromDatabase);

  if (calculatedAttributes.length) {
    await storeToDb(COLLECTION_NAME, calculatedAttributes);
    context.log(`Successfully stored calculated data ${dataDate}`);
  } else {
    context.log(
      `No new attributes calculated in calculationTemplate at invocation ${context.executionContext.invocationId}.`,
    );
  }
};

export default calculationTemplate;
