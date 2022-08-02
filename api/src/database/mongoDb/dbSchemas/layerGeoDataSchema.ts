import mongoose from 'mongoose';
import { LAYER_TYPES, GEO_FORMATS } from './constants';
import MetadataSchema from './metadataSchema';

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
  geoDataFilename: String,
  geoDataUrl: String,
  updateDate: String,
  storeToDb: Boolean,
  collectionName: String,
  apiUrl: String,
  format: {
    type: String,
    enum: GEO_FORMATS,
  },
  featureIds: [FeatureIdSchema],
  attributeIds: [{ type: String }],
  geometryDataTypes: {
    type: String,
    enum: LAYER_TYPES,
  },
  metadata: MetadataSchema,
});

export default mongoose.model('LayerGeoData', layerGeoDataSchema, 'layerGeoData');
