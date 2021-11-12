import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { bbox } from 'ol/loadingstrategy';
import axios from 'axios';
import gpkgSourceLoader from '../loaders/gpkgSourceLoader';

import { geometryStyleFactory } from '../styles';

const createVectorSource = (layerData, handleIsLoading) => {
  const vectorSource = new VectorSource({
    loader: async (extent, resolution, projection) => {
      handleIsLoading({ title: layerData.title, type: 'geometry' }, 'add');
      try {
        const response = await axios.get(layerData.geoDataUrl);
        const newFeatures = vectorSource.getFormat().readFeatures(response.data, { featureProjection: projection });
        vectorSource.addFeatures(newFeatures);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
        vectorSource.removeLoadedExtent(extent);
      } finally {
        handleIsLoading(layerData.title, 'remove');
      }
    },
    format: new GeoJSON(),
    strategy: bbox,
  });

  return vectorSource;
};

const geometryLayer = (layerData, handleIsLoading) => {
  let vectorSource;
  if (layerData.format === 'gpkg') {
    vectorSource = gpkgSourceLoader(layerData, handleIsLoading);
  } else {
    vectorSource = createVectorSource(layerData, handleIsLoading);
  }
  const newLayer = new VectorLayer({
    title: layerData.title,
    attribute: layerData.attribute,
    attributeDescription: layerData.attributeDescription,
    featureId: layerData.featureId,
    type: layerData.layerType,
    source: vectorSource,
    zIndex: 1,
    style: layerData.style ? geometryStyleFactory(layerData.attribute, layerData.style) : undefined,
    legend: layerData.legend,
  });
  newLayer.selectable = true;
  if (layerData.visible) {
    newLayer.setVisible(true);
  } else {
    newLayer.setVisible(false);
  }
  return newLayer;
};

export default geometryLayer;
