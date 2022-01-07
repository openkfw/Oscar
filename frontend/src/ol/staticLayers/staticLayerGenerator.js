import { staticLayersTypes } from '../../constants';
import regionsLayer from './layerTypes/regions';
import pointsLayer from './layerTypes/points';
import geometryLayer from './layerTypes/geometry';
import combinedLayer from './layerTypes/combined';
// eslint-disable-next-line import/no-cycle
import groupLayer from './layerTypes/group';

const staticLayerGenerator = (layerData, handleIsLoading) => {
  let layerOptions;
  if (layerData.timeseries !== null) {
    layerOptions = { timeseries: layerData.timeseries };
  } else {
    layerOptions = layerData.layerOptions;
  }
  switch (layerData.layerType) {
    case staticLayersTypes.REGIONS: {
      return regionsLayer({ ...layerData, layerOptions }, handleIsLoading);
    }
    case staticLayersTypes.POINTS: {
      return pointsLayer({ ...layerData, layerOptions }, handleIsLoading);
    }
    case staticLayersTypes.GEOMETRY: {
      return geometryLayer({ ...layerData, layerOptions }, handleIsLoading);
    }
    case staticLayersTypes.GROUP: {
      return groupLayer({ ...layerData, layerOptions }, handleIsLoading);
    }
    case staticLayersTypes.COMBINED: {
      return combinedLayer({ ...layerData, layerOptions }, handleIsLoading);
    }
    // eslint-disable-next-line no-empty
    default: {
    }
  }
};
export default staticLayerGenerator;
