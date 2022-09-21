import { dataLayersTypes } from '../../constants';
import regionsLayer from './layerTypes/regions';
import pointsLayer from './layerTypes/points';
import geometryLayer from './layerTypes/geometry';
import combinedLayer from './layerTypes/combined';
import tileLayer from './layerTypes/tiles';
// eslint-disable-next-line import/no-cycle
import groupLayer from './layerTypes/group';

const dataLayerGenerator = (layerData, handleIsLoading) => {
  if (!layerData.layerOptions) {
    // eslint-disable-next-line no-param-reassign
    layerData.layerOptions = { timeseries: layerData.timeseries, maxResolution: layerData.maxResolution };
  }
  switch (layerData.layerType) {
    case dataLayersTypes.REGIONS: {
      return regionsLayer(layerData, handleIsLoading);
    }
    case dataLayersTypes.POINTS: {
      return pointsLayer(layerData, handleIsLoading);
    }
    case dataLayersTypes.GEOMETRY: {
      return geometryLayer(layerData, handleIsLoading);
    }
    case dataLayersTypes.GROUP: {
      return groupLayer(layerData, handleIsLoading);
    }
    case dataLayersTypes.COMBINED: {
      return combinedLayer(layerData, handleIsLoading);
    }
    case dataLayersTypes.TILE: {
      return tileLayer(layerData, handleIsLoading);
    }
    // eslint-disable-next-line no-empty
    default: {
    }
  }
};
export default dataLayerGenerator;
