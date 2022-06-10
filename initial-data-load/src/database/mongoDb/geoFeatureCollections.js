const mongoose = require('mongoose');

const { GeoFeatureSchema } = require('./schemas/geoFeatureSchema');

const storeGeoFeaturesData = (collectionName, data) => {
  const GeoFeatureModel = mongoose.model('GeoFeature', GeoFeatureSchema, collectionName);
  return GeoFeatureModel.insertMany(data);
};

module.exports = { storeGeoFeaturesData };
