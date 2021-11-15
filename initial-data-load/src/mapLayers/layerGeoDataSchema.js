const mongoose = require('mongoose');
const { LAYER_TYPES, GEO_FORMATS } = require('./constants');
const MetadataSchema = require('./metadataSchema')

const FeatureIdSchema = new mongoose.Schema(
  {
    property: String,
    values: [{ type: String }],
  },
  { _id: false },
);

const layerGeoDataSchema = new mongoose.Schema({
  referenceId: { type: String, index: { unique: true } },
  name: String,
  geoDataUrl: String,
  updateDate: String,
  format: {
    type: String,
    enum: GEO_FORMATS
  },
  featureIds: [FeatureIdSchema],
  attributeIds: [{ type: String }],
  geometryDataTypes: {
    type: String,
    enum: LAYER_TYPES,
  },
  metadata: MetadataSchema,
});

module.exports = mongoose.model('LayerGeoData', layerGeoDataSchema, 'layerGeoData');
