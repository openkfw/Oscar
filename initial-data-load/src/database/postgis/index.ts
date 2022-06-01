// const pg = require('pg');
import Knex from 'knex';
import knexPostgis from 'knex-postgis';
import logger from '../../config/winston';

import knexConfig from './knexfile';

const knex = Knex(knexConfig.development);
knexPostgis(knex);

let pool = null;

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

/**
 * Destroys Knex client
 */
export const disconnect = async () => {
  if (pool && pool.destory) {
    await pool.destroy();
    pool = null;
  }
};

/**
 * Clear all rows from table
 * @param  {string} tableName
 * @param  {} db
 */
export const clearTable = async (tableName: string, db = getDb()) => {
  await db(tableName).del();
  logger.info(`Table ${tableName} was successfully cleared`);
};

export default { getDb, disconnect, clearTable };
