/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { getDb } from '../index';
import { getBoundingBox, getProjectionFilter } from '../filters';
import APIError from '../../../helpers/APIError';

const getGeoData = async (tableName: string, bottomLeft?: string, topRight?: string, proj?: string, db = getDb()) => {
  const filter: {
    geometry?: {
      type: string,
      coordinates: Array<Array<Array<number>>>,
    },
    proj?: number,
  } = {};
  if (bottomLeft && topRight) {
    filter.geometry = getBoundingBox(bottomLeft, topRight);
    filter.proj = await getProjectionFilter(proj, tableName);
  }

  const data = await db
    .from(tableName)
    .select('id', db.raw('ST_AsGeoJSON(geometry) as geometry'), 'properties')
    .where((qb) => {
      if (filter.geometry && filter.proj) {
        qb.andWhere(
          db.raw(`ST_Intersects(geometry, ST_SetSRID(ST_GeomFromGeoJSON(?), ${filter.proj}))`, [
            JSON.stringify(filter.geometry),
          ]),
        );
      }
    });
  return data.map((item) => ({ ...item, geometry: JSON.parse(item.geometry) }));
};

const getProperty = async (tableName: string, propertyName: string, db = getDb()) => {
  const data = await db.from(tableName).select('id', db.raw(`properties->>'${propertyName}' as value`));
  return data;
};

const getUniqueValuesForProperty = async (tableName: string, propertyName: string, db = getDb()) => {
  const data = await db
    .from(tableName)
    .select(db.raw(`properties->>'${propertyName}' as property`))
    .distinct(db.raw(`properties->>'${propertyName}'`));
  return data.map((item) => item.property);
};

const getPropertySum = async (tableName: string, propertyName: string, db = getDb()) => {
  try {
    const data = await db.from(tableName).sum(db.raw(`properties->>'${propertyName}'`));
    return data;
  } catch (error) {
    throw new APIError(`Attempting to sum non-numeric values for property ${propertyName}.`, 500, false, error);
  }
};

export default { getGeoData, getProperty, getUniqueValuesForProperty, getPropertySum };
