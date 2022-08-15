import config from '../config/config';
import logger from '../config/winston';
import APIError from '../helpers/APIError';
import mongoDb from './mongoDb/models/isochronesModel';

export const getIsochronesByCoordinates = async (avoidedDisasters: boolean) => {
  if (config.postgresUser && config.postgresPassword && config.postgresDb) {
    logger.info('Functionality is not yet implemented in postgresql.');
    return;
  }
  if (config.mongoUri) {
    return mongoDb.getIsochronesByCoordinates(avoidedDisasters);
  }
  throw new APIError('No credentials for database', 500, false, undefined);
};

export default { getIsochronesByCoordinates };
