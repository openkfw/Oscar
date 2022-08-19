import { getDb } from './index';
import APIError from '../../helpers/APIError';

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
        [topRightArr[0], bottomLeftArr[1]],
        topRightArr,
        [bottomLeftArr[0], topRightArr[1]],
        bottomLeftArr,
      ],
    ],
  };

  return geometry;
};

/**
 * Connect to database table to verify that projection of geometry data from API is compatible with table.
 * @param  {string} proj - projection of data from API
 * @param  {string} tableName - name of table with geographical data
 * @param  {} db=getDb() - database connection or transaction
 */
export const getProjectionFilter = async (proj, tableName, db = getDb()) => {
  // projection in query must correspond to SRID in geometry column
  if (proj) {
    const SRIDarr = await db.distinct(db.raw(`ST_SRID(${tableName}.geometry)`)).from(tableName);

    if (!SRIDarr.length) {
      return;
    }
    const SRID = SRIDarr[0].st_srid;
    const projNum = parseInt(proj.split(':')[1], 10);

    if (SRID === projNum) {
      return projNum;
    }
    throw new APIError(
      `Projection SRID ${projNum} doesn't correspond to geometry column SRID ${SRID}`,
      400,
      true,
      undefined,
    );
  }
};

export default { getBoundingBox, getProjectionFilter };
