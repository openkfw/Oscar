const mongoose = require('mongoose');

const FeatureIdsSchema = new mongoose.Schema(
  {
    property: String,
    values: [{ type: String }],
  },
  { _id: false },
);

const metadataSchema = new mongoose.Schema(
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
  featureIds: [FeatureIdsSchema],
  attributeIds: [{ type: String }],
  geometryDataTypes: {
    type: String,
    enum: ['points', 'regions', 'geometry'],
  },
  metadata: metadataSchema,
});

module.exports = mongoose.model('LayerGeoData', layerGeoDataSchema, 'layerGeoData');
