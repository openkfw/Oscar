import VectorLayer from 'ol/layer/Vector';
import ClusterSource from 'ol/source/Cluster';

import { pointStyleFactory } from '../styles';
import loaderVectorSource from '../utils';

const pointsLayer = (layerData, handleIsLoading) => {
  const vectorSource = loaderVectorSource(layerData, handleIsLoading, layerData.title, 'points');

  const newLayer = new VectorLayer({
    title: layerData.title,
    attribute: layerData.attribute,
    attributeDescription: layerData.attributeDescription,
    featureId: layerData.featureId,
    type: layerData.layerType,
    source: new ClusterSource({
      source: vectorSource,
      distance: 40,
    }),
    style: pointStyleFactory(layerData.attribute, layerData.style),
    legend: layerData.legend,
    zIndex: 2,
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
export default pointsLayer;
