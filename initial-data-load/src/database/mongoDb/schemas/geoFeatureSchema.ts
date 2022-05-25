import mongoose from 'mongoose';

const GeometrySchema = new mongoose.Schema(
  {
    type: String,
    coordinates: Array,
  },
  { _id: false },
);

const BboxSchema = new mongoose.Schema(
  {
    type: String,
    coordinates: Array,
  },
  { _id: false },
);

const GeoFeatureSchema = new mongoose.Schema({
  type: String,
  properties: mongoose.Schema.Types.Mixed,
  geometry: GeometrySchema,
  bbox: BboxSchema,
});

export default GeoFeatureSchema;
