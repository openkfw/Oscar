const model = require('../models/mapLayerModel');
const { getLayerGeoDataWithUrl } = require('../models/layerGeoDataModel');

/**
 * Returns map layers from mapLayers collection with link to GeoJson file from layerGeoData collection
 */
const getMapLayersWithGeoData = async () => {
  // find all available geoData
  const haveGeoData = await getLayerGeoDataWithUrl();

  let geoReferenceIds = [];
  const geoData = {};
  let filterOr = [];

  if (haveGeoData) {
    geoReferenceIds = haveGeoData.map((item) => item.referenceId);
    haveGeoData.forEach((item) => {
      geoData[item.referenceId] = item;
    });

    // filter mapLayers only for the ones with geoData in file or potentially in database
    filterOr = [
      { geoReferenceId: { $in: geoReferenceIds } },
      { layers: { $elemMatch: { geoReferenceId: { $in: geoReferenceIds } } } },
    ];
  }

  const filter = {
    $or: [
      ...filterOr,
      { layerType: 'points' }, // layers with all values stored in pointAttributes collection, like disaster response functionality
      { layerType: 'tile' }, // layers with tile data at external url
    ],
  };

  const layers = await model.getMapLayers(filter);

  const layersWithGeoDataUrl = layers.map((layer) => {
    if (layer.layerType === 'group') {
      const sublayers = layer.layers.map((lr) => {
        if (geoData[lr.geoReferenceId]) {
          return {
            ...lr,
            geoDataUrl: geoData[lr.geoReferenceId].geoDataUrl,
            format: geoData[lr.geoReferenceId].format,
            metadata: { geoMetadata: geoData[lr.geoReferenceId].metadata },
          };
        }
        return lr;
      });
      return { ...layer, layers: sublayers };
    }
    if (geoData[layer.geoReferenceId]) {
      return {
        ...layer,
        geoDataUrl: geoData[layer.geoReferenceId].geoDataUrl,
        format: geoData[layer.geoReferenceId].format,
        metadata: { ...layer.metadata, geoMetadata: geoData[layer.geoReferenceId].metadata },
      };
    }
    return layer;
  });
  return layersWithGeoDataUrl;
};

module.exports = { getMapLayersWithGeoData };
