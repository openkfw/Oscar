import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { toLonLat } from 'ol/proj';
import { getTopRight, getBottomLeft } from 'ol/extent';
import { bbox } from 'ol/loadingstrategy';

import { getGeoData } from '../../../axiosRequests';

const boxReloadVectorSourceLoader = (layerData, handleIsLoading, title) => {
  const vectorSource = new VectorSource({
    format: new GeoJSON(),
    loader: async (extent, resolution, projection) => {
      handleIsLoading({ title }, 'add');

      const proj = projection.getCode();
      // convert extent to geo coordinates
      const bottomLeft = toLonLat(getBottomLeft(extent));
      const topRight = toLonLat(getTopRight(extent));

      const searchParams = new URLSearchParams();
      searchParams.append('attributeId', layerData.attribute);

      const url =
        `/api/pointAttributes?${searchParams}&bottomLeft=${bottomLeft.join(',')}` +
        `&topRight=${topRight.join(',')}&proj=${proj}`;
      const response = await getGeoData(url);
      if (response && response.features && response.features[0]) {
        const newFeatures = vectorSource.getFormat().readFeatures(response, { featureProjection: projection });
        vectorSource.addFeatures(newFeatures);
      }
      handleIsLoading(title, 'remove');
    },
    strategy: bbox,
  });

  return vectorSource;
};

export default boxReloadVectorSourceLoader;
