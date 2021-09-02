const filterCoordinates = (filter, bottomLeft, topRight) => {
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

module.exports = { filterCoordinates };
