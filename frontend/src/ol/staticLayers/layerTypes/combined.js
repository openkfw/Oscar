import VectorLayer from 'ol/layer/Vector';
import vectorSourceLoader from '../loaders/vectorSourceLoader';
import { combinedStyleFactory } from '../styles';

const combinedLayer = (layerData, handleIsLoading) => {
  const vectorSource = vectorSourceLoader(layerData, handleIsLoading, layerData.title, 'region');

  const newLayer = new VectorLayer({
    title: layerData.title,
    attribute: layerData.attribute,
    attributeDescription: layerData.attributeDescription,
    featureId: layerData.featureId,
    type: layerData.layerType,
    source: vectorSource,
    zIndex: 2,
    style: combinedStyleFactory(layerData.attribute, layerData.style),
    legend: layerData.legend,
    minZoom: 11,
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

export default combinedLayer;
