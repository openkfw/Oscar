import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';

const tileLayer = (layerData) => {
  const newLayer = new TileLayer({
    title: layerData.title,
    attribute: layerData.attribute,
    attributeDescription: layerData.attributeDescription,
    featureId: layerData.featureId,
    type: layerData.layerType,
    source: new XYZ({
      url: layerData.geoDataUrl,
      attributions: (layerData.metadata && layerData.metadata.geoMetadata && layerData.metadata.geoMetadata.description),
    }),
    zIndex: 0,
    layerOptions: layerData.layerOptions,
    maxResolution: (layerData.layerOptions && layerData.layerOptions.maxResolution) || layerData.maxResolution,
  });
  newLayer.selectable = true;
  if (layerData.visible) {
    newLayer.setVisible(true);
  } else {
    newLayer.setVisible(false);
  }
  return newLayer;
};

export default tileLayer;
