const model = require('../models/mapLayerModel');
const { getLayerGeoDataWithUrl } = require('../models/layerGeoDataModel');

const getMapLayersWithGeoData = async () => {
  const haveGeoData = await getLayerGeoDataWithUrl();
  if (!haveGeoData || haveGeoData.length === 0) {
    return [];
  }
  const geoReferenceIds = haveGeoData.map((item) => item.referenceId);
  const geoDataUrls = {};
  const formats = {};
  haveGeoData.forEach((item) => {
    geoDataUrls[item.referenceId] = item.geoDataUrl;
    formats[item.referenceId] = item.format;
  });
  const filter = {
    $or: [
      { geoReferenceId: { $in: geoReferenceIds } },
      { layers: { $elemMatch: { geoReferenceId: { $in: geoReferenceIds } } } },
      { geoReferenceId: null },
    ],
  };

  const layers = await model.getMapLayers(filter);
  const layersWithGeoDataUrl = layers.map((layer) => {
    if (layer.layerType === 'group') {
      const sublayers = layer.layers.map((lr) => ({
        ...lr,
        geoDataUrl: geoDataUrls[lr.geoReferenceId],
        format: formats[lr.geoReferenceId],
      }));
      return { ...layer, layers: sublayers };
    }

    return {
      ...layer,
      geoDataUrl: geoDataUrls[layer.geoReferenceId],
      format: formats[layer.geoReferenceId],
    };
  });
  return layersWithGeoDataUrl;
};

module.exports = { getMapLayersWithGeoData };
