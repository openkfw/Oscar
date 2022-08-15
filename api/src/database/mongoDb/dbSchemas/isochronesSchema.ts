import mongoose from 'mongoose';

const FeaturePropertiesSchema = new mongoose.Schema(
  {
    group_index: Number,
    value: Number,
    center: [Number, Number],
    area: Number,
    reachfactor: Number,
    total_pop: Number,
  },
  { _id: false },
);

const FeatureGeometrySchema = new mongoose.Schema(
  {
    coordinates: mongoose.Schema.Types.Mixed,
    type: String,
  },
  { _id: false },
);

const FeaturesSchema = new mongoose.Schema(
  {
    type: String,
    properties: FeaturePropertiesSchema,
    geometry: FeatureGeometrySchema,
  },
  { _id: false },
);

const IsochronesSchema = new mongoose.Schema({
  geoIndexId: { type: [Number, Number], index: '2dsphere' },
  geoIndexString: String,
  features: [FeaturesSchema],
  avoidedDisasters: Boolean,
  timestamp: Number,
});

export default mongoose.model('Isochrone', IsochronesSchema);
