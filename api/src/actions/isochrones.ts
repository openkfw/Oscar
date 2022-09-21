import APIError from '../helpers/APIError';
import logger from '../config/winston';

import { getCoordinatesFromPointsCollection } from '../database/geodata';

import { getIsochronesByCoordinates } from '../database/isochrones';

export const getIsochronesByPointsSource = async (pointsSource: string, bottomLeft, topRight) => {
  if (pointsSource === 'hospitals') {
    logger.info('Getting positions of hospitals...');
    const points = await getCoordinatesFromPointsCollection('healthSites', bottomLeft, topRight);
    logger.info(`Getting isochrones for ${points.length} hospitals...`);
    // const pointStrings = points.map((point) => JSON.stringify(point));
    const isochrones = await getIsochronesByCoordinates(true);
    const isochroneFeatures = [];
    if (isochrones && isochrones.length) {
      isochrones.forEach((item) => {
        item.features.forEach((feature) => {
          const enhancedFeature = {
            type: feature.type,
            geometry: feature.geometry,
            properties: feature.properties,
            id: `${item._id}-${feature.properties.value}`,
          };
          isochroneFeatures.push(enhancedFeature);
        });
      });
    }
    return isochroneFeatures;
  }
  throw new APIError(`pointsSource ${pointsSource} is not valid.`, 400, true);
};

export default { getIsochronesByPointsSource };
