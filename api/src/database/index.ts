/* eslint-disable import/no-named-as-default-member */
import config from '../config/config';
import APIError from '../helpers/APIError';

import mongoDb from './mongoDb';
import postgis from './postgis';

/**
 * Initializes postgresql database if its credentials and name are provided or mongodb database if connection string is provided or throws error, when none found
 */
export const initializeDb = () => {
  if (config.postgresUser && config.postgresPassword && config.postgresDb) {
    return postgis.getDb();
  }
  if (config.mongoUri) {
    return mongoDb.initializeDBConnection();
  }
  throw new APIError('No credentials for database', 500, false, undefined);
};

export default { initializeDb };
