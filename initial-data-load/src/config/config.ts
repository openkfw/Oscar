import Joi from '@hapi/joi';

// require and configure dotenv, will load vars in .env in PROCESS.ENV
require('dotenv').config();

// define validation for all the env vars
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string().allow('development', 'production', 'test', 'provision').default('development'),
  PORT: Joi.number().default(8080),
  LOG_LABEL: Joi.string().default('oscar-initial-data-upload'),
  AZURE_STORAGE_CONNECTION_STRING: Joi.string(),
  AZURE_STORAGE_LAYER_CONTAINER_NAME: Joi.string(),
  MONGO_URI: Joi.string().allow('', null),
  DB_NAME: Joi.string().allow('', null),
  POSTGRES_USER: Joi.string().allow('', null),
  POSTGRES_PASSWORD: Joi.string().allow('', null),
  POSTGRES_DB: Joi.string().allow('', null),
  POSTGRES_HOST: Joi.string().allow('', null),
  POSTGRES_PORT: Joi.number().allow(null),
  UPLOAD_DATA_TYPES: Joi.string().allow('', null),
  COUNTRY: Joi.string().default('').allow('', null),
  DATASET: Joi.string().allow(null),
  NEW_STORAGE_CONTAINERS: Joi.string().allow('').default(''),
  NEW_STORAGE_QUEUES: Joi.string().allow('').default(''),
})
  .unknown()
  .required();

const { error, value: envVars } = envVarsSchema.validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  logLabel: envVars.LOG_LABEL,
  mongoUri: envVars.MONGO_URI,
  dbName: envVars.DB_NAME,
  postgresUser: envVars.POSTGRES_USER,
  postgresPassword: envVars.POSTGRES_PASSWORD,
  postgresDb: envVars.POSTGRES_DB,
  postgresHost: envVars.POSTGRES_HOST,
  azureStorageConnectionString: envVars.AZURE_STORAGE_CONNECTION_STRING,
  azureStorageLayerContainerName: envVars.AZURE_STORAGE_LAYER_CONTAINER_NAME,
  uploadDataTypes: envVars.UPLOAD_DATA_TYPES,
  country: envVars.COUNTRY,
  dataset: envVars.DATASET,
  newStorageContainers: envVars.NEW_STORAGE_CONTAINERS,
  newStorageQueues: envVars.NEW_STORAGE_QUEUES,
};

export default config;
