import VectorLayer from 'ol/layer/Vector';

import { regionStyleFactory } from '../styles';
import vectorSourceLoader from '../loaders/vectorSourceLoader';

const regionsLayer = (layerData, handleIsLoading) => {
  const vectorSource = vectorSourceLoader(layerData, handleIsLoading, layerData.title, 'region');

  const newLayer = new VectorLayer({
    title: layerData.title,
    attribute: layerData.attribute,
    attributeDescription: layerData.attributeDescription,
    featureId: layerData.featureId,
    type: layerData.layerType,
    source: vectorSource,
    style: regionStyleFactory(layerData.attribute, layerData.style),
    legend: layerData.legend,
    zIndex: 0,
    layerOptions: layerData.layerOptions,
    maxResolution: layerData.layerOptions.maxResolution || layerData.maxResolution || undefined,
  });
  newLayer.selectable = true;
  if (layerData.visible) {
    newLayer.setVisible(true);
  } else {
    newLayer.setVisible(false);
  }
  return newLayer;
};

export default regionsLayer;
