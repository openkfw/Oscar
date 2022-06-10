// import logger from '../../config/winston';
// import { APIRegionAttribute, MapLayerConfigItem, PostgresRegionAttribute } from '../../types';
// import { ATTRIBUTES_TABLE, REGION_ATTRIBUTES_TABLE } from './constants';
// import { getDb } from './index';
// import { emptyAttributesItem, attributeDataToDBFormat, attributeTypeFromMapLayerType } from './utils';

// /**
//  * Creates new items in attributes table to ensure foreign key restraint passing for following operations
//  * This function is to keep config files format and expected functionality in line with current mongoDb implementation
//  * Should be deprecated when config structure is updated to new data structure and attributes collection is used
//  * @param  {Knex} db - knex connection
//  * @param  {Array<string>} attributeIds - array with attributeIds, that need to be checked
//  */
// export const verifyAttributeConfigExists = async (attributeIds: Array<string>, db = getDb()) => {
//   if (!attributeIds.length) {
//     return;
//   }
//   const attributeItemsForDb = attributeIds.map((attributeId) => emptyAttributesItem(attributeId));
//   await db(ATTRIBUTES_TABLE).insert(attributeItemsForDb).onConflict().ignore();
// };

// /**
//  * Helper to store data from map layer config file into new data structure
//  * @param  {MapLayerConfigItem} data - configuration of map layer in config format
//  * @param  {} db -
//  */
// export const storeAttributeConfigFromMapLayer = async (data: MapLayerConfigItem, db = getDb()) => {
//   const attributeIntoDb = {
//     attribute_id: data.attributeData.attributeId,
//     attribute_type: attributeTypeFromMapLayerType(data.layerType),
//     attribute_key: data.attributeData.attributeId,
//     name: data.title,
//     geo_data: {
//       referenceId: data.geoReferenceId,
//       featureId: data.featureId,
//     },
//     data: {
//       availableDatesSource: data.attributeData && data.attributeData.availableDatesSource,
//     },
//     metadata: data.metadata,
//   };

//   const placeholderAttributeConfig = await db(ATTRIBUTES_TABLE)
//     .insert(attributeIntoDb)
//     .onConflict('attribute_id')
//     .merge();
//   return placeholderAttributeConfig;
// };

// /**
//  * Stores values in database
//  * @param  {Array<object>} data - array of items in database format
//  * @param  {Knex} db - knex
//  */
// const storeAttributes = async (data: Array<PostgresRegionAttribute>, db = getDb()) => {
//   await db(REGION_ATTRIBUTES_TABLE)
//     .insert(data)
//     .onConflict(['attribute_id', 'feature_id', 'feature_id_lvl', 'date_iso'])
//     .merge();
// };

// /**
//  * Saves region attributes in database table with all required steps for compatibility
//  * @param  {Array<object>} data - data in API format
//  */
// const saveAttributes = async (data: Array<APIRegionAttribute>) => {
//   const uniqueAttributeIds: Array<string> = data.reduce((prev, curr) => {
//     if (!prev.includes(curr.attributeId)) {
//       prev.push(curr.attributeId);
//     }
//     return prev;
//   }, []) as Array<string>;
//   const dataToDb: Array<PostgresRegionAttribute> = data.map((item) => attributeDataToDBFormat(item));
//   const db = getDb();
//   await db.transaction(async (trx) => {
//     await verifyAttributeConfigExists(uniqueAttributeIds, trx);
//     logger.info(`Verified that attributeIds ${uniqueAttributeIds} are valid attributes.`);
//     await storeAttributes(dataToDb, trx);
//   });
//   logger.info(`Successfully stored ${data.length} attributes for attributeId(s) ${uniqueAttributeIds}`);
// };

// export default { saveAttributes };
