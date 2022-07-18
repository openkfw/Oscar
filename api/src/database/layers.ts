import config from '../config/config';
import APIError from '../helpers/APIError';

import mongoDb from './mongoDb/models/layerModel';
import postgis from './postgis/models/layerModel';

/**
 * Returns all map layers with correctly defined geographical data
 */
export const getMapLayersWithGeoData = async () => {
  if (config.postgresUser && config.postgresPassword && config.postgresDb) {
    return postgis.getMapLayersWithGeoData();
  }
  if (config.mongoUri) {
    return mongoDb.getMapLayersWithGeoData();
  }
  throw new APIError('No credentials for database', 500, false, undefined);
};

export default { getMapLayersWithGeoData };
