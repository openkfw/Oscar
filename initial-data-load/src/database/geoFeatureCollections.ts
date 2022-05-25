import config from '../config/config';
import mongoDb from './mongoDb/geoFeatureCollections';

// eslint-disable-next-line import/prefer-default-export
export const storeGeoFeaturesData = (collectionName, data) => {
  if (config.postgresUser && config.postgresPassword && config.postgresDb) {
    console.log('...todo postgis version.');
  }
  if (config.mongoUri) {
    // eslint-disable-next-line import/no-named-as-default-member
    return mongoDb.storeGeoFeaturesData(collectionName, data);
  }
  throw new Error('No credentials for database');
};
