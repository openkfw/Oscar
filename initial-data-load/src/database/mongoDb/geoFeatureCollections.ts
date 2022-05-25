import mongoose from 'mongoose';

import GeoFeatureSchema from './schemas/geoFeatureSchema';

// eslint-disable-next-line import/prefer-default-export
export const storeGeoFeaturesData = (collectionName, data) => {
  const GeoFeatureModel = mongoose.model('GeoFeature', GeoFeatureSchema, collectionName);
  return GeoFeatureModel.insertMany(data);
};

export default { storeGeoFeaturesData };
