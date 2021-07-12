const Joi = require('joi');

// require and configure dotenv, will load vars in .env in PROCESS.ENV
require('dotenv').config();

// define validation for all the env vars
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string().allow(['development', 'production', 'test', 'provision']).default('development'),
  PORT: Joi.number().default(8080),
  LOG_LABEL: Joi.string().default('oscar-url-loader-service'),
  AZURE_STORAGE_CONNECTION_STRING: Joi.string(),
  AZURE_STORAGE_DATA_CONTAINER_NAME: Joi.string(),
  MONGO_URI: Joi.string(),
  USERNAME: Joi.string().allow(''),
  PASSWORD: Joi.string().allow(''),
  URL_FILE: Joi.string().allow(''),
  ONLY_SOURCE_NAMES: Joi.string().allow(''),
  EXCEPT_SOURCE_NAMES: Joi.string().allow(''),
  URL_LOAD_BOTTLENECK_TIME_LIMIT: Joi.number().default(1000),
  URL_LOAD_BOTTLENECK_MAX_CONCURRENT: Joi.number().default(1),
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
  azureStorageConnectionString: envVars.AZURE_STORAGE_CONNECTION_STRING,
  azureStorageRawDataContainerName: envVars.AZURE_STORAGE_DATA_CONTAINER_NAME,
  mongoUri: envVars.MONGO_URI,
  username: envVars.USERNAME,
  password: envVars.PASSWORD,
  urlFile: envVars.URL_FILE,
  onlySourceNames: envVars.ONLY_SOURCE_NAMES,
  exceptSourceNames: envVars.EXCEPT_SOURCE_NAMES,
  bottleneckTimeLimit: envVars.URL_LOAD_BOTTLENECK_TIME_LIMIT,
  bottleneckMaxConcurrent: envVars.URL_LOAD_BOTTLENECK_MAX_CONCURRENT,
};
module.exports = config;
