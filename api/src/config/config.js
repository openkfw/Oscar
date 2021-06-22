const Joi = require('joi');

// require and configure dotenv, will load vars in .env in PROCESS.ENV
require('dotenv').config();

// define validation for all the env vars
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string().allow(['development', 'production', 'test', 'provision']).default('development'),
  PORT: Joi.number().default(8080),
  LOG_LABEL: Joi.string().default('oscar-api'),
  MONGO_URI: Joi.string(),
  AZURE_STORAGE_CONNECTION_STRING: Joi.string(),
  AZURE_STORAGE_LAYER_CONTAINER_NAME: Joi.string(),
  AZURE_STORAGE_CONTAINER_NAME: Joi.string(),
  AUTHORIZE_TOKEN_ATTRIBUTE: process.env.NODE_ENV === 'test' ? Joi.bool().default(false) : Joi.bool().default(true),
  AUTHORIZATION_EXPECTED_TOKEN_ATTRIBUTE: Joi.string(),
  AUTHORIZATION_EXPECTED_TOKEN_ATTRIBUTE_VALUE: Joi.string(),
  APPINSIGHTS_INSTRUMENTATIONKEY: Joi.string(),

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
  azureStorageContainerName: envVars.AZURE_STORAGE_CONTAINER_NAME,
  azureStorageLayerContainerName: envVars.AZURE_STORAGE_LAYER_CONTAINER_NAME,
  authorizeTokenAttribute: envVars.AUTHORIZE_TOKEN_ATTRIBUTE,
  authorizationExpectedTokenAttribute: envVars.AUTHORIZATION_EXPECTED_TOKEN_ATTRIBUTE,
  authorizationExpectedTokenAttributeValue: envVars.AUTHORIZATION_EXPECTED_TOKEN_ATTRIBUTE_VALUE,
  appInsightsInstrumentationKey: envVars.APPINSIGHTS_INSTRUMENTATIONKEY,
};

module.exports = config;
