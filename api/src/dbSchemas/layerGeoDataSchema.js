const mongoose = require('mongoose');

const FeatureIdSchema = new mongoose.Schema(
  {
    property: String,
    values: [{ type: String }],
  },
  { _id: false },
);

const GeoMetadataSchema = new mongoose.Schema(
  {
    description: String,
    sourceWebsite: String,
    sourceOrganisation: String,
    updateDate: String,
    updateFrequency: String,
    unit: String,
    reliabilityScore: String,
    dataRetrievalDescription: String,
    dataCalculationDescription: String,
  },
  { _id: false },
);

const layerGeoDataSchema = new mongoose.Schema({
  referenceId: { type: String, index: { unique: true } },
  name: String,
  geoDataUrl: String,
  updateDate: String,
  format: String,
  featureId: [FeatureIdSchema],
  attributeIds: [{ type: String }],
  geometryDataTypes: {
    type: String,
    enum: ['points', 'regions', 'geometry'],
  },
  geoMetadata: GeoMetadataSchema,
});

module.exports = mongoose.model('LayerGeoData', layerGeoDataSchema, 'layerGeoData');
