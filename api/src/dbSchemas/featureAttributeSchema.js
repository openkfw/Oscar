const mongoose = require('mongoose');

const FEATURE_ATTRIBUTES_COLLECTION_NAME = 'featureAttributes';

const AttributeSchema = new mongoose.Schema({
  date: String,
  dataDate: String,
  attributeId: String,
  featureId: String,
});

const FeatureAttribute = mongoose.model('FeatureAttribute', AttributeSchema, FEATURE_ATTRIBUTES_COLLECTION_NAME);

const NumberAttribute = FeatureAttribute.discriminator(
  'NumberAttribute',
  new mongoose.Schema({
    valueNumber: Number,
  }),
);

const StringAttribute = FeatureAttribute.discriminator(
  'StringAttribute',
  new mongoose.Schema({
    valueString: String,
  }),
);

const DataDateAttribute = FeatureAttribute.discriminator(
  'DataDateAttribute',
  new mongoose.Schema({
    valueNumber: String,
    dataDate: String,
  }),
);


module.exports = {
  FEATURE_ATTRIBUTES_COLLECTION_NAME,
  FeatureAttribute,
  NumberAttribute,
  StringAttribute,
  DataDateAttribute,
};
