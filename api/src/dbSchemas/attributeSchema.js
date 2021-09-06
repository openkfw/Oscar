const mongoose = require('mongoose');

const AttributeSchema = new mongoose.Schema({
  date: String,
  dataDate: String,
  attributeId: String,
  featureId: String,
});

const Attribute = mongoose.model('Attribute', AttributeSchema, 'attributes');

const NumberAttribute = Attribute.discriminator(
  'NumberAttribute',
  new mongoose.Schema({
    valueNumber: Number,
  }),
);

const StringAttribute = Attribute.discriminator(
  'StringAttribute',
  new mongoose.Schema({
    valueString: String,
  }),
);

const DataDateAttribute = Attribute.discriminator(
  'DataDateAttribute',
  new mongoose.Schema({
    valueNumber: String,
    dataDate: String,
  }),
);

const ATTRIBUTES_COLLECTION_NAME = 'attributes';

module.exports = {
  ATTRIBUTES_COLLECTION_NAME,
  Attribute,
  NumberAttribute,
  StringAttribute,
  DataDateAttribute,
};
