import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { toLonLat } from 'ol/proj';
import { getTopRight, getBottomLeft } from 'ol/extent';
import { bbox } from 'ol/loadingstrategy';

import { getAttributesData, getGeoData } from '../../axiosRequests';

const boxReloadVectorSourceLoader = (layerData, handleIsLoading, title) => {
  const vectorSource = new VectorSource({
    format: new GeoJSON(),
    loader: async (extent, resolution, projection) => {
      handleIsLoading({ title }, 'add');

      const proj = projection.getCode();
      // convert extent to geo coordinates
      // we also need to clear the vector source
      const bottomLeft = toLonLat(getBottomLeft(extent));
      const topRight = toLonLat(getTopRight(extent));

      let baseUrl;
      let escapedAttribute;
      if (layerData.attribute) {
        escapedAttribute = layerData.attribute;
      }
      if (layerData.geoDataUrl) {
        baseUrl = `${layerData.geoDataUrl}?`;
      } else {
        const searchParams = new URLSearchParams();
        searchParams.append('attributeId', escapedAttribute);
        baseUrl = `/api/pointAttributes?${searchParams}`;
      }
      const url = `${baseUrl}&bottomLeft=${bottomLeft.join(',')}&topRight=${topRight.join(',')}&proj=${proj}`;
      const response = await getGeoData(url);
      if (response && response.features && response.features[0]) {
        if (response.features[0].properties && !response.features[0].properties.hasOwnProperty(layerData.attribute)) {
          let attributes = [];

          if (layerData.attribute) {
            if (vectorSource.get('sliderDate') && layerData.timeseries) {
              const searchParams = new URLSearchParams();
              searchParams.append('attributeId', escapedAttribute);
              searchParams.append('dateStart', vectorSource.get('sliderDate'));
              searchParams.append('dateEnd', vectorSource.get('sliderDate'));
              attributes = await getAttributesData(searchParams);
            } else {
              const searchParams = new URLSearchParams();
              searchParams.append('attributeId', escapedAttribute);
              searchParams.append('latestValues', true);
              attributes = await getAttributesData(searchParams);
            }
          }

          const { features } = response;

          const enrichedFeatures = features.map((feature) => {
            const additionalData = attributes.find(
              (d) =>
                d.featureId &&
                feature.properties[layerData.featureId] &&
                d.featureId.toLowerCase() === feature.properties[layerData.featureId].toLowerCase(),
            );
            return additionalData
              ? {
                  ...feature,
                  properties: {
                    ...feature.properties,
                    [layerData.attribute]: additionalData.value,
                    date: additionalData.date.substring(0, additionalData.date.indexOf('T')),
                    dataDate: additionalData.dataDate,
                  },
                }
              : feature;
          });
          const featuresStruct = {
            ...response,
            features: enrichedFeatures,
          };

          const newDbFeatures = vectorSource
            .getFormat()
            .readFeatures(featuresStruct, { featureProjection: projection });

          vectorSource.addFeatures(newDbFeatures);
          handleIsLoading(title, 'remove');
        } else {
          const newFeatures = vectorSource.getFormat().readFeatures(response, { featureProjection: projection });
          vectorSource.addFeatures(newFeatures);
        }
      }
      handleIsLoading(title, 'remove');
    },
    strategy: bbox,
  });

  return vectorSource;
};

export default boxReloadVectorSourceLoader;
