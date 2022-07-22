// const pg = require('pg');
import Knex from 'knex';
import knexPostgis from 'knex-postgis';

import knexConfig from './knexfile';

const knex = Knex(knexConfig.development);
knexPostgis(knex);

const pool = null;

/**
 * Gets Knex client object, if not set, initializes new one
 */
export function getDb() {
  if (pool === null) {
    const newPool = Knex(knexConfig.development);
    return newPool;
  }
  return pool;
}

export default { getDb };
