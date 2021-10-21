const mongoose = require('mongoose');

const layerGeoDataSchema = new mongoose.Schema({
  referenceId: { type: String, index: { unique: true } },
  name: String,
  geoDataUrl: String,
  updateDate: String,
});

module.exports = mongoose.model('LayerGeoData', layerGeoDataSchema, 'layerGeoData');
