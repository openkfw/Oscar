import Joi from '@hapi/joi';

// require and configure dotenv, will load vars in .env in PROCESS.ENV
require('dotenv').config();

// define validation for all the env vars
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string().allow('development', 'production', 'test', 'provision').default('development'),
  PORT: Joi.number().default(8080),
  LOG_LABEL: Joi.string().default('oscar-api'),
  MONGO_URI: Joi.string().allow('', null),
  DB_NAME: Joi.string().allow('', null),
  POSTGRES_USER: Joi.string().allow('', null),
  POSTGRES_PASSWORD: Joi.string().allow('', null),
  POSTGRES_DB: Joi.string().allow('', null),
  POSTGRES_HOST: Joi.string().allow('', null),
  POSTGRES_PORT: Joi.number().allow('', null),
  AZURE_STORAGE_CONNECTION_STRING: Joi.string(),
  AZURE_STORAGE_LAYER_CONTAINER_NAME: Joi.string(),
  AUTHORIZE_TOKEN_ATTRIBUTE: process.env.NODE_ENV === 'test' ? Joi.bool().default(false) : Joi.bool().default(true),
  AUTHORIZATION_EXPECTED_TOKEN_ATTRIBUTE: Joi.string().allow(''),
  AUTHORIZATION_EXPECTED_TOKEN_ATTRIBUTE_VALUE: Joi.string().allow(''),
  APPINSIGHTS_INSTRUMENTATIONKEY: Joi.string().allow(''),
  OPENAPI_SCHEMA_FILE: Joi.string().default('src/openapi/apiSchema.yml'),
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
  postgresPort: envVars.POSTGRES_PORT,
  azureStorageConnectionString: envVars.AZURE_STORAGE_CONNECTION_STRING,
  azureStorageLayerContainerName: envVars.AZURE_STORAGE_LAYER_CONTAINER_NAME,
  authorizeTokenAttribute: envVars.AUTHORIZE_TOKEN_ATTRIBUTE,
  authorizationExpectedTokenAttribute: envVars.AUTHORIZATION_EXPECTED_TOKEN_ATTRIBUTE,
  authorizationExpectedTokenAttributeValue: envVars.AUTHORIZATION_EXPECTED_TOKEN_ATTRIBUTE_VALUE,
  appInsightsInstrumentationKey: envVars.APPINSIGHTS_INSTRUMENTATIONKEY,
  openApiSchemaFile: envVars.OPENAPI_SCHEMA_FILE,
};

export default config;
