const mongoose = require('mongoose');

const featureIdSchema = new mongoose.Schema(
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
  format: String,
  featureId: [featureIdSchema],
  attributeIds: [{ type: String }],
  geometryDataTypes: {
    type: String,
    enum: ['points', 'regions', 'geometry'],
  },
  metadata: Object,
});

module.exports = mongoose.model('LayerGeoData', layerGeoDataSchema, 'layerGeoData');
