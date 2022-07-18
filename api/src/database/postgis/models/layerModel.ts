/* eslint-disable func-names */

import { getDb } from '../index';
import { LAYER_GEO_DATA_TABLE, MAP_LAYERS_TABLE } from '../constants';
import {
  PostgresMapLayerWithGeoData,
  MongoDbMapLayerWithGeoData,
  PostgresSublayerGeoData,
  PostgresSublayerGeoDataWithReferenceId,
} from '../../../types';
import { DBFormatToMapLayerWithGeoData } from '../utils';

/**
 * Returns map layers from mapLayers collection with link to GeoJson file from layerGeoData collection
 * @param  {Knex} db - knex connection
 */
const getMapLayersWithGeoData = async (db = getDb()): Promise<Array<MongoDbMapLayerWithGeoData>> => {
  const singleMapLayersWithGeoData: Array<PostgresMapLayerWithGeoData> = await db
    .select(
      `${MAP_LAYERS_TABLE}.*`,
      `${LAYER_GEO_DATA_TABLE}.geo_data_url`,
      `${LAYER_GEO_DATA_TABLE}.format`,
      `${LAYER_GEO_DATA_TABLE}.metadata`,
    )
    .from(MAP_LAYERS_TABLE)
    .orderBy('title', 'asc')
    // filter mapLayers only for the ones with geoData in file or potentially in database
    .innerJoin(LAYER_GEO_DATA_TABLE, function () {
      this.on(`${MAP_LAYERS_TABLE}.geo_reference_id`, '=', `${LAYER_GEO_DATA_TABLE}.reference_id`);
    });

  const groupMapLayersWithGeoData: Array<PostgresMapLayerWithGeoData> = await db.transaction(async (trx) => {
    const groupMapLayersOrdered = await trx
      .select('*')
      .from(MAP_LAYERS_TABLE)
      .orderBy('title', 'asc')
      .where('layer_type', '=', 'group');
    const sublayersGeoreferenceIds: Array<string> = groupMapLayersOrdered
      .map((groupMapLayer) => groupMapLayer.layers.map((layer) => layer.geo_reference_id))
      .flat()
      .filter((georeferenceId) => georeferenceId);
    // filter sublayers geoData for retrieved group mapLayers
    const sublayersGeoData: Array<PostgresSublayerGeoData> = await trx
      .select('reference_id', 'geo_data_url', 'format', 'metadata')
      .from(LAYER_GEO_DATA_TABLE)
      .whereIn('reference_id', sublayersGeoreferenceIds);
    const sublayersGeoDataWithReferenceIds: PostgresSublayerGeoDataWithReferenceId | {} = {};
    sublayersGeoData.forEach((sublayerGeodata) => {
      sublayersGeoDataWithReferenceIds[sublayerGeodata.reference_id] = sublayerGeodata;
    });
    // return group map layers with geodata for their sublayers
    const groupMapLayersWithSublayersGeoData: Array<PostgresMapLayerWithGeoData> = groupMapLayersOrdered.map(
      (layer) => {
        const sublayers = layer.layers.map((lr) => {
          if (sublayersGeoDataWithReferenceIds[lr.geo_reference_id]) {
            return {
              ...lr,
              geo_data_url: sublayersGeoDataWithReferenceIds[lr.geo_reference_id].geo_data_url,
              format: sublayersGeoDataWithReferenceIds[lr.geo_reference_id].format,
              metadata: { geoMetadata: sublayersGeoDataWithReferenceIds[lr.geo_reference_id].metadata },
            };
          }
          return lr;
        });
        return { ...layer, layers: sublayers };
      },
    );
    return groupMapLayersWithSublayersGeoData;
  });

  const singleMapLayersWithGeoDataConverted = singleMapLayersWithGeoData.map((mapLayer) =>
    DBFormatToMapLayerWithGeoData(mapLayer),
  );
  const groupMapLayersWithGeoDataConverted = groupMapLayersWithGeoData.map((mapLayer) =>
    DBFormatToMapLayerWithGeoData(mapLayer),
  );

  const mapLayersWithGeoDataMerged = [...singleMapLayersWithGeoDataConverted, ...groupMapLayersWithGeoDataConverted];

  const mapLayersWithGeoDataMergedSorted = mapLayersWithGeoDataMerged.sort(function (a, b) {
    const titleA = a.title.toUpperCase(); // ignore upper and lowercase
    const titleB = b.title.toUpperCase(); // ignore upper and lowercase
    if (titleA < titleB) {
      return -1;
    }
    if (titleA > titleB) {
      return 1;
    }

    // names must be equal
    return 0;
  });

  return mapLayersWithGeoDataMergedSorted;
};

export default { getMapLayersWithGeoData };
