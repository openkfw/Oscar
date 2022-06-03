import config from '../config/config';
import mongoDb from './mongoDb/geoFeatureCollections';
import postgis from './postgis/geoFeatureCollection';

// eslint-disable-next-line import/prefer-default-export
export const storeGeoFeaturesData = (collectionName: string, data) => {
  if (config.postgresUser && config.postgresPassword && config.postgresDb) {
    return postgis.storeFeatures(collectionName, data);
  }
  if (config.mongoUri) {
    // eslint-disable-next-line import/no-named-as-default-member
    return mongoDb.storeGeoFeaturesData(collectionName, data);
  }
  throw new Error('No credentials for database');
};
