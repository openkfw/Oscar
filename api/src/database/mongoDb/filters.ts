/**
 * Add $geoIntersects filter for mongoose filter query
 * @param  {object} filter - existing filter object
 * @param  {string} bottomLeft - bottom left corner of boundingBox window, string 'lon,lat'
 * @param  {string} topRight - top right corner of boundingBox window, string 'lon,lat'
 */
export const filterCoordinates = (filter, bottomLeft, topRight) => {
  const bottomLeftArr = bottomLeft.split(',').map((point) => parseFloat(point));
  const topRightArr = topRight.split(',').map((point) => parseFloat(point));

  return {
    ...filter,
    geometry: {
      $geoIntersects: {
        // we have to use geometry with GeoJSON
        $geometry: {
          type: 'Polygon',
          coordinates: [
            [
              bottomLeftArr,
              [bottomLeftArr[0], topRightArr[1]],
              topRightArr,
              [topRightArr[0], bottomLeftArr[1]],
              bottomLeftArr,
            ],
          ],
        },
      },
    },
  };
};

export default { filterCoordinates };
