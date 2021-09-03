import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';

import { getAttributesData, getGeojsonData } from '../../../axiosRequests';

const vectorSourceLoader = (layerData, handleIsLoading, title, type) => {
  const vectorSource = new VectorSource({
    format: new GeoJSON(),
    loader: async (extent, resolution, projection) => {
      handleIsLoading({ title, type }, 'add');
      const url = layerData.geoJSONUrl;

      const response = await getGeojsonData(url);

      if (response) {
        if (response.features && response.features[0]) {
          if (response.features[0].properties && !response.features[0].properties.hasOwnProperty(layerData.attribute)) {
            let latestAttributes = [];

            if (layerData.attribute) {
              if (vectorSource.get('sliderDate') && layerData.timeseries) {
                const searchParams = new URLSearchParams();
                searchParams.append('attributeId', layerData.attribute);
                searchParams.append('dateStart', vectorSource.get('sliderDate'));
                searchParams.append('dateEnd', vectorSource.get('sliderDate'));
                latestAttributes = await getAttributesData(searchParams);
              } else {
                const searchParams = new URLSearchParams();
                searchParams.append('attributeId', layerData.attribute);
                searchParams.append('latestValues', true);
                latestAttributes = await getAttributesData(searchParams);
              }
            }

            const { features } = response;

            const enrichedFeatures = features.map((feature) => {
              const additionalData = latestAttributes.find(
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
      }
    },
  });

  return vectorSource;
};

export default vectorSourceLoader;