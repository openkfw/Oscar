import { AzureFunction, Context } from '@azure/functions';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import Joi from '@hapi/joi';

import config from './config';
import { initializeDBConnection } from './db';
import { configSchema } from './joiSchemas';
import sevenDaysIncidenceRate from './calculation';

/**
 * Function triggered by new message in Azure Storage Queue.
 * Getting data from database for given attributeIds and date and storing new calculated data
 * - connects to the MongoDB (creates a connection if needed)
 * - fetch data, calculate and store new data
 * @param {object} context - Azure function' context (e.g. for logging)
 */
const incidenceRateCalculation: AzureFunction = async (context: Context): Promise<void> => {
  const dateISOString = new Date().toISOString();
  context.log(`Starting queue trigger function at ${dateISOString}`);

  // Get date from message, else now is used
  const dataDate = context.bindings.queueMessage.date || dateISOString;

  // Connect to database
  await initializeDBConnection(context);
  context.log('Database connection initialized');

  const configurationFile = await yaml.load(fs.readFileSync(path.join(__dirname, config.configFile), 'utf8'));
  Joi.assert(configurationFile, Joi.array().items(configSchema));
  const configurationData = configurationFile[0];

  // calculate 7 days incidence rate
  context.log(`Calculating incidence rate in ${configurationData.countryLevel2}...`);
  await sevenDaysIncidenceRate(context, dataDate, configurationData.countryLevel2, configurationData);
  context.log(`Calculating incidence rate in ${configurationData.countryLevel1}...`);
  await sevenDaysIncidenceRate(context, dataDate, configurationData.countryLevel1, configurationData);
  context.log(`Calculating incidence rate in ${configurationData.countryLevel0}...`);
  await sevenDaysIncidenceRate(context, dataDate, configurationData.countryLevel0, configurationData);

  context.log('Calculation of 7 days incidence rate successfully finished');
};

export default incidenceRateCalculation;
