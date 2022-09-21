import LayerGroup from 'ol/layer/Group';
// eslint-disable-next-line import/no-cycle
import dataLayerGenerator from '../dataLayerGenerator';

const groupLayer = (layerData, handleIsLoading) => {
  const newLayer = new LayerGroup({
    title: layerData.title,
    type: layerData.layerType,
    legend: layerData.legend,
    layers: layerData.layers.map((layer) =>
      dataLayerGenerator(
        {
          ...layer,
          visible: true,
          maxResolution: (layerData.layerOptions && layerData.layerOptions.maxResolution) || layerData.maxResolution,
        },
        handleIsLoading,
      ),
    ),
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
