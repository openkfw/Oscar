/**
 * Return bounding box in GeoJSON format used for filtering
 * @param  {string} bottomLeft - bottom left corner of boundingBox window, string 'lon,lat'
 * @param  {string} topRight - top right corner of boundingBox window, string 'lon,lat'
 */
export const getBoundingBox = (bottomLeft: string, topRight: string) => {
  const bottomLeftArr = bottomLeft.split(',').map((point) => parseFloat(point));
  const topRightArr = topRight.split(',').map((point) => parseFloat(point));

  const geometry = {
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
  };

  return geometry;
};

export default { getBoundingBox };
