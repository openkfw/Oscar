import VectorLayer from 'ol/layer/Vector';
import loaderVectorSource from '../utils';
import { combinedStyleFactory } from '../styles';

const combinedLayer = (layerData, handleIsLoading) => {
  const vectorSource = loaderVectorSource(layerData, handleIsLoading, layerData.title, 'region');

  const newLayer = new VectorLayer({
    title: layerData.title,
    attribute: layerData.attribute,
    attributeDescription: layerData.attributeDescription,
    featureId: layerData.featureId,
    type: layerData.layerType,
    source: vectorSource,
    zIndex: 1,
    style: combinedStyleFactory(layerData.attribute, layerData.style),
    legend: layerData.legend,
    minZoom: 11,
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
