import mongoose from 'mongoose';

export const AttributeSchema = new mongoose.Schema({
  date: String,
  dataDate: String,
  attributeId: String,
  featureId: String,
});

export const Attribute = mongoose.model('Attribute', AttributeSchema, 'attributes');

export const NumberAttribute = Attribute.discriminator(
  'NumberAttribute',
  new mongoose.Schema({
    valueNumber: Number,
  }),
);

export const StringAttribute = Attribute.discriminator(
  'StringAttribute',
  new mongoose.Schema({
    valueString: String,
  }),
);

export const DataDateAttribute = Attribute.discriminator(
  'DataDateAttribute',
  new mongoose.Schema({
    valueNumber: String,
    dataDate: String,
  }),
);

export const ATTRIBUTES_COLLECTION_NAME = 'attributes';

export default {
  ATTRIBUTES_COLLECTION_NAME,
  Attribute,
  NumberAttribute,
  StringAttribute,
  DataDateAttribute,
};
