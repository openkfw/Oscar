import { staticLayersTypes } from '../../constants';
import regionsLayer from './layerTypes/regions';
import pointsLayer from './layerTypes/points';
import geometryLayer from './layerTypes/geometry';
import combinedLayer from './layerTypes/combined';
import tileLayer from './layerTypes/tiles';
// eslint-disable-next-line import/no-cycle
import groupLayer from './layerTypes/group';

const staticLayerGenerator = (layerData, handleIsLoading) => {
  if (!layerData.layerOptions) {
    // eslint-disable-next-line no-param-reassign
    layerData.layerOptions = { timeseries: layerData.timeseries, maxResolution: layerData.maxResolution };
  }
  switch (layerData.layerType) {
    case staticLayersTypes.REGIONS: {
      return regionsLayer(layerData, handleIsLoading);
    }
    case staticLayersTypes.POINTS: {
      return pointsLayer(layerData, handleIsLoading);
    }
    case staticLayersTypes.GEOMETRY: {
      return geometryLayer(layerData, handleIsLoading);
    }
    case staticLayersTypes.GROUP: {
      return groupLayer(layerData, handleIsLoading);
    }
    case staticLayersTypes.COMBINED: {
      return combinedLayer(layerData, handleIsLoading);
    }
    case staticLayersTypes.TILE: {
      return tileLayer(layerData, handleIsLoading);
    }
    // eslint-disable-next-line no-empty
    default: {
    }
  }
};
export default staticLayerGenerator;
