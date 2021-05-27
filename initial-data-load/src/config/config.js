const Joi = require('joi');

// require and configure dotenv, will load vars in .env in PROCESS.ENV
require('dotenv').config();

// define validation for all the env vars
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string().allow(['development', 'production', 'test', 'provision']).default('development'),
  PORT: Joi.number().default(8080),
  LOG_LABEL: Joi.string().default('oscar-initial-data-upload'),
  AZURE_STORAGE_CONNECTION_STRING: Joi.string(),
  AZURE_STORAGE_LAYER_CONTAINER_NAME: Joi.string().default('layer-geo-data'),
  AZURE_STORAGE_DATA_CONTAINER_NAME: Joi.string().default('raw-data'),
  MONGO_URI:
    process.env.NODE_ENV === 'test'
      ? Joi.string().default('mongodb://localhost:27917/oscar')
      : Joi.string().default('mongodb://localhost:27017/oscar'),
  UPLOAD_DATA_TYPES: Joi.string().allow('', null).default('mapLayers,attributes'),
  COUNTRY: Joi.string().default(''),
  NEW_STORAGE_CONTAINERS: Joi.string().allow('').default(''),
  NEW_STORAGE_QUEUES: Joi.string().allow('').default(''),
})
  .unknown()
  .required();

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  logLabel: envVars.LOG_LABEL,
  mongoUri: envVars.MONGO_URI,
  azureStorageConnectionString: envVars.AZURE_STORAGE_CONNECTION_STRING,
  azureStorageLayerContainerName: envVars.AZURE_STORAGE_LAYER_CONTAINER_NAME,
  azureStorageDataContainerName: envVars.AZURE_STORAGE_DATA_CONTAINER_NAME,
  uploadDataTypes: envVars.UPLOAD_DATA_TYPES,
  country: envVars.COUNTRY,
  newStorageContainers: envVars.NEW_STORAGE_CONTAINERS,
  newStorageQueues: envVars.NEW_STORAGE_QUEUES,
};

module.exports = config;
