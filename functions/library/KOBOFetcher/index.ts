import { AzureFunction, Context } from '@azure/functions';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import Joi from 'joi';

import config from './config';
import { initializeDBConnection } from './db';
import surveyHandler from './components/surveyHandler';
import { surveySchema } from './joiSchemas';

/**
 * Function to fetch data from KOBO api and store them as point attributes in database
 * @param {object} context - Azure function's context (e.g. for metadata, logging)
 */
const KOBOFetcher: AzureFunction = async (context: Context): Promise<void> => {
  // initialize connection to database
  context.log('Connecting to database...');
  await initializeDBConnection(context);

  const data = await yaml.load(fs.readFileSync(path.join(__dirname, config.KOBOConfigFilePath), 'utf8'));
  Joi.assert(data, Joi.array().items(surveySchema));

  const dataStored = data.map((survey) => surveyHandler(survey, context));
  await Promise.all(dataStored);

  context.log(`Successfully updated ${dataStored.filter((item) => item).length} of ${dataStored.length} survey(s).`);
};

export default KOBOFetcher;
