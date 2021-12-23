const mongoose = require('mongoose');

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

const GeoFeaturesSchema = new mongoose.Schema({
  type: String,
  properties: mongoose.Schema.Types.Mixed,
  geometry: GeometrySchema,
  bbox: BboxSchema,
});

module.exports = {
  GeoFeaturesSchema,
};
