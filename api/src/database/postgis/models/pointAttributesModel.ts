import { Knex } from 'knex';
import APIError from '../../../helpers/APIError';
import { POINT_ATTRIBUTES_TABLE } from '../constants';
import { getBoundingBox } from '../filters';
import { dateIsValidDatum } from '../../../helpers/utils';
import { getDb } from '../index';
import { PointAttributeFilter, PointAttribute } from '../../../types';

/**
 * Create specific conditions with the filter, that retrieved rows needs to match
 * @param  {PostgreAttributeFilter} filter - filter composed from settings from query
 * @param  {Knex.QueryBuilder} qb
 */
const getAttributesFilterConditions = (filter: PointAttributeFilter, qb: Knex.QueryBuilder, db = getDb()): void => {
  if (filter.attributeId) {
    qb.whereRaw(`properties->>'attributeId' = ?`, [filter.attributeId]);
  }

  if (filter.dateStart) {
    qb.andWhere(db.raw(`properties->>'date' >= ?`, [filter.dateStart]));
  }

  if (filter.dateEnd) {
    qb.andWhere(db.raw(`properties->>'date' <= ?`, [filter.dateEnd]));
  }

  if (filter.date) {
    qb.andWhere(db.raw(`properties->>'date' = ?`, [filter.date]));
  }

  if (filter.geometry && filter.proj) {
    qb.andWhere(
      db.raw(`ST_Intersects(geometry, ST_SetSRID(ST_GeomFromGeoJSON(?), ${filter.proj}))`, [
        JSON.stringify(filter.geometry),
      ]),
    );
  }
};

const getProjectionFilter = async (proj, db = getDb()) => {
  // projection in query must correspond to SRID in geometry column
  if (proj) {
    const SRIDarr = await db
      .distinct(db.raw(`ST_SRID(${POINT_ATTRIBUTES_TABLE}.geometry)`))
      .from(POINT_ATTRIBUTES_TABLE);

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

/**
 * Compose filter from settings from query
 * @param  {string} attributeId - id of point attribute
 * @param  {string} bottomLeft - bottom left corner of boundingBox window, string 'lon,lat'
 * @param  {string} topRight - top right corner of boundingBox window, string 'lon,lat'
 * @param  {string} dateStart - ISOString to take attributes from
 * @param  {string} dateEnd - ISOString to take attributes until
 */
const getFilteredPointAttributes = async (
  attributeId: string,
  bottomLeft: string,
  topRight: string,
  dateStart: string,
  dateEnd: string,
  proj: string,
  db = getDb(),
): Promise<Array<PointAttribute>> => {
  const filter: PointAttributeFilter = {};
  if (bottomLeft && topRight) {
    filter.geometry = getBoundingBox(bottomLeft, topRight);
  }
  if (attributeId) {
    filter.attributeId = attributeId;
  }

  if (filter.geometry) {
    filter.proj = await getProjectionFilter(proj);
  }

  // date filters
  if (dateStart && dateEnd) {
    if (dateIsValidDatum(dateStart) && dateIsValidDatum(dateEnd)) {
      if (!(new Date(dateStart) <= new Date(dateEnd))) {
        throw new APIError('Invalid date format: Start date is greater than end date', 400, true, undefined);
      }
      filter.dateStart = dateStart;
      filter.dateEnd = dateEnd;
    } else {
      throw new APIError('Invalid date format', 400, true, undefined);
    }
  } else if (dateStart) {
    if (!dateIsValidDatum(dateStart)) {
      throw new APIError('Invalid date format', 400, true, undefined);
    }
    filter.dateStart = dateStart;
  } else if (dateEnd) {
    if (!dateIsValidDatum(dateEnd)) {
      throw new APIError('Invalid date format', 400, true, undefined);
    }
    filter.dateEnd = dateEnd;
  }

  const attributes = await db
    .from(POINT_ATTRIBUTES_TABLE)
    .select(
      'attribute_id as attributeId',
      db.raw(`ST_AsGeoJSON(geometry) as geometry`),
      'properties',
      'created_at as createdAt',
      'updated_at as updatedAt',
    )
    .where((qb) => {
      getAttributesFilterConditions(filter, qb);
    });

  return attributes.map((attribute) => {
    return { ...attribute, geometry: JSON.parse(attribute.geometry) };
  });
};

/**
 * Get PointAttributes for the last date in database
 * @param  {string} attributeId - id of point attribute
 * @param  {string} bottomLeft - bottom left corner of boundingBox window, string 'lon,lat'
 * @param  {string} topRight - top right corner of boundingBox window, string 'lon,lat'
 * @param  {Knex} db - knex connection
 */
const getLastDatePointAttributes = async (
  attributeId: string,
  bottomLeft: string,
  topRight: string,
  proj: string,
  db = getDb(),
): Promise<Array<PointAttribute>> => {
  const filter: PointAttributeFilter = {};
  if (bottomLeft && topRight) {
    filter.geometry = getBoundingBox(bottomLeft, topRight);
  }
  if (attributeId) {
    filter.attributeId = attributeId;
  }
  if (filter.geometry) {
    filter.proj = await getProjectionFilter(proj);
  }

  const lastDate = await db
    .select('properties')
    .from(POINT_ATTRIBUTES_TABLE)
    .whereRaw(`properties->>'attributeId' = ?`, [filter.attributeId])
    .orderByRaw(`properties->>'date' desc`)
    .limit(1);

  if (!lastDate || !lastDate.length) {
    throw new APIError(
      `Failed fetching last date for ${attributeId} in ${POINT_ATTRIBUTES_TABLE}`,
      500,
      false,
      undefined,
    );
  }

  // eslint-disable-next-line prefer-destructuring
  filter.date = lastDate[0].properties.date;
  const pointAttributes = await db
    .select(
      'attribute_id as attributeId',
      db.raw(`ST_AsGeoJSON(geometry) as geometry`),
      'properties',
      'created_at as createdAt',
      'updated_at as updatedAt',
    )
    .from(POINT_ATTRIBUTES_TABLE)
    .where((qb) => {
      getAttributesFilterConditions(filter, qb);
    });

  return pointAttributes.map((attribute) => {
    return { ...attribute, geometry: JSON.parse(attribute.geometry) };
  });
};

/**
 * Get unique property values
 * @param  {string} attributeId - id of point attribute
 * @param  {string} property - key in properties object in item
 * @param  {Knex} db - knex connection
 */
const getUniqueValues = async (attributeId: string, property: string, db = getDb()): Promise<Array<string>> => {
  if (!attributeId || !property) {
    throw new APIError('AttributeId or property missing', 400, false, undefined);
  }

  const uniquePropertyValues = await db
    .distinct(db.raw(`properties->>'${property}' as ${property}`))
    .from(POINT_ATTRIBUTES_TABLE)
    .whereRaw(`properties->>'attributeId' = ?`, [attributeId])
    .andWhere(db.raw(`properties->>'${property}' IS NOT NULL`))
    .orderByRaw(property);

  return uniquePropertyValues.map((item) => item[property.toLowerCase()]);
};

export default { getFilteredPointAttributes, getLastDatePointAttributes, getUniqueValues };
