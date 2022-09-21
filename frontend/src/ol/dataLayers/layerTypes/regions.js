import VectorLayer from 'ol/layer/Vector';
import boxReloadVectorSourceLoader from '../boxReloadVectorSourceLoader';
import vectorSourceLoader from '../vectorSourceLoader';
import { regionStyleFactory } from '../styles';

const regionsLayer = (layerData, handleIsLoading) => {
  let vectorSource;
  if (layerData.geoDataUrl.includes('uploads')) {
    vectorSource = vectorSourceLoader(layerData, handleIsLoading, layerData.title, 'region');
  } else {
    vectorSource = boxReloadVectorSourceLoader(layerData, handleIsLoading, layerData.title);
  }

  const newLayer = new VectorLayer({
    title: layerData.title,
    attribute: layerData.attribute,
    attributeDescription: layerData.attributeDescription,
    featureId: layerData.featureId,
    type: layerData.layerType,
    source: vectorSource,
    style: regionStyleFactory(layerData.attribute, layerData.style),
    legend: layerData.legend,
    zIndex: 1,
    layerOptions: layerData.layerOptions,
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
