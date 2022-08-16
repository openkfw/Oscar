import Isochrone from '../dbSchemas/isochronesSchema';

const getIsochronesByCoordinates = async (avoidedDisasters) => {
  let isochrones = await Isochrone.find({ avoidedDisasters });
  isochrones = isochrones.filter((item) => item);

  return isochrones;
};

export default { getIsochronesByCoordinates };
