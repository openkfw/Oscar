import { LAYER_GEO_DATA_TABLE, MAP_LAYERS_TABLE } from './constants';
import { getDb } from './index';
import { layerGeoDataToDBFormat, mapLayerToDBFormat } from './utils';
import { storeAttributeConfigFromMapLayer } from './attributes';
import { GeoDataConfigItem } from '../../types';

export const saveLayerGeoData = (data: Array<GeoDataConfigItem>, db = getDb()) =>
  db
    .insert(data.map((item) => layerGeoDataToDBFormat(item)))
    .into(LAYER_GEO_DATA_TABLE)
    .onConflict('reference_id')
    .merge();

export const getOneLayerGeoData = async (referenceId, db = getDb()) => {
  const geoData = await db.select('*').from(LAYER_GEO_DATA_TABLE).where({ reference_id: referenceId });
  if (!geoData.length) {
    return false;
  }
  return geoData[0];
};

export const saveMapLayers = async (data, db = getDb()) => {
  // eslint-disable-next-line array-callback-return
  const savingMapLayers = data.map(async (layer) => {
    const dbLayer = mapLayerToDBFormat(layer);
    if (layer.attributeData.attributeId) {
      await storeAttributeConfigFromMapLayer(layer);
    }
    await db(MAP_LAYERS_TABLE).insert(dbLayer).onConflict('reference_id').merge();
  });
  await Promise.all(savingMapLayers);
};

export const getOneMapLayer = (referenceId: string, db = getDb()) =>
  db.select('*').from(MAP_LAYERS_TABLE).where({ reference_id: referenceId });

export default { saveLayerGeoData, getOneLayerGeoData, saveMapLayers, getOneMapLayer };
