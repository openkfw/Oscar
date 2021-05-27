const LayerGeoDataSchema = require('../dbSchemas/layerGeoDataSchema');

const getLayerGeoDataWithUrl = () =>
  LayerGeoDataSchema.find({ geoJSONUrl: { $ne: null } })
    .lean()
    .exec();

module.exports = { getLayerGeoDataWithUrl };
