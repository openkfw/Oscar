import VectorLayer from 'ol/layer/Vector';

import { regionStyleFactory } from '../styles';
import loaderVectorSource from '../utils';

const regionsLayer = (layerData, handleIsLoading) => {
  const vectorSource = loaderVectorSource(layerData, handleIsLoading, layerData.title, 'region');

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
    timeseries: layerData.timeseries,
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
