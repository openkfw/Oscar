import * as Joi from '@hapi/joi';
import * as dotenv from 'dotenv';

// require and configure dotenv, will load vars in .env in PROCESS.ENV
dotenv.config();

// define validation for all the env vars
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test', 'provision').default('development'),
  MONGO_URI:
    process.env.NODE_ENV === 'test'
      ? Joi.string().default('mongodb://localhost:27917/oscar')
      : Joi.string().default('mongodb://localhost:27017/oscar'),
  DB_NAME: Joi.string(),
  LOADER_BOTTLENECK_TIME_LIMIT: Joi.number().default(1000),
  LOADER_BOTTLENECK_MAX_CONCURRENT: Joi.number().default(1),
})
  .unknown()
  .required();

const { error, value: envVars } = envVarsSchema.validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  mongoUri: envVars.MONGO_URI,
  dbName: envVars.DB_NAME,
  bottleneckTimeLimit: envVars.POPULATION_LOAD_BOTTLENECK_TIME_LIMIT,
  bottleneckMaxConcurent: envVars.POPULATION_LOAD_BOTTLENECK_MAX_CONCURRENT,
};

export default config;
