const model = require('../models/mapLayerModel');
const { getLayerGeoDataWithUrl } = require('../models/layerGeoDataModel');

const getMapLayersWithGeoData = async () => {
  const haveGeoData = await getLayerGeoDataWithUrl();
  if (!haveGeoData || haveGeoData.length === 0) {
    return [];
  }
  const geoReferenceIds = haveGeoData.map((item) => item.referenceId);
  const geoJSONUrls = {};
  haveGeoData.forEach((item) => {
    geoJSONUrls[item.referenceId] = item.geoJSONUrl;
  });
  const filter = {
    $or: [
      { geoReferenceId: { $in: geoReferenceIds } },
      { layers: { $elemMatch: { geoReferenceId: { $in: geoReferenceIds } } } },
      { geoReferenceId: null },
    ],
  };

  const layers = await model.getMapLayers(filter);
  const layersWithGeoJSONUrl = layers.map((layer) => {
    if (layer.layerType === 'group') {
      const sublayers = layer.layers.map((lr) => ({
        ...lr,
        geoJSONUrl: geoJSONUrls[lr.geoReferenceId],
      }));
      return { ...layer, layers: sublayers };
    }

    return {
      ...layer,
      geoJSONUrl: geoJSONUrls[layer.geoReferenceId],
    };
  });
  return layersWithGeoJSONUrl;
};

module.exports = { getMapLayersWithGeoData };
