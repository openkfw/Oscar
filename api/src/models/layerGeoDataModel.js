const LayerGeoDataSchema = require('../dbSchemas/layerGeoDataSchema');

const getLayerGeoDataWithUrl = () =>
  LayerGeoDataSchema.find({ geoDataUrl: { $ne: null } })
    .lean()
    .exec();

module.exports = { getLayerGeoDataWithUrl };
