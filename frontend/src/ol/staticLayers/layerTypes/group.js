import LayerGroup from 'ol/layer/Group';
// eslint-disable-next-line import/no-cycle
import staticLayerGenerator from '../staticLayerGenerator';

const groupLayer = (layerData, handleIsLoading) => {
  const newLayer = new LayerGroup({
    title: layerData.title,
    type: layerData.layerType,
    legend: layerData.legend,
    layers: layerData.layers.map((layer) => staticLayerGenerator({ ...layer, visible: true }, handleIsLoading)),
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

export default groupLayer;
