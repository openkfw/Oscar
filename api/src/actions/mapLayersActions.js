const model = require('../models/mapLayerModel');
const { getLayerGeoDataWithUrl } = require('../models/layerGeoDataModel');

const getMapLayers = async () => {
  const haveGeoData = await getLayerGeoDataWithUrl();
  const geoJSONUrls = {};
  if (haveGeoData && haveGeoData.length > 0) {
    haveGeoData.forEach((item) => {
      geoJSONUrls[item.referenceId] = item.geoJSONUrl;
    });
  }

  const layers = await model.getMapLayers({});
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

module.exports = { getMapLayers };
