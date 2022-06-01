/**
 * Converting attribute value item in API format to postgres database 'region_attributes' format
 * @param  {object} item - item in API format
 */
export const attributeDataToDBFormat = (item) => ({
  attribute_id: item.attributeId,
  feature_id: item.featureId,
  feature_id_lvl: item.featureType,
  value: item.value,
  value_type: item.valueType || 'text',
  date_iso: item.date,
  date_data: item.dataDate,
});

/**
 * Creates empty attribute item for given attributeId
 * @param  {string} attributeId -
 */
export const emptyAttributesItem = (attributeId) => ({
  attribute_id: attributeId,
});

/**
 * Converting attribute data in
 * @param  {string} attributeId
 * @param  {object} data - other data to be filled in this table
 */
export const attributesItemFromData = (attributeId: string, data) => ({
  attribute_id: attributeId,
  attribute_type: data.attributeType,
  name: data.name,
  geo_data: data.geoData,
  metadata: data.metadata,
});

export const layerGeoDataToDBFormat = (item) => ({
  reference_id: item.referenceId,
  name: item.name,
  format: item.format,
  geo_data_url: item.geoDataUrl,
  data: {
    featureIds: item.featureIds,
    attributeIds: item.attributeIds,
    geometryDataTypes: item.geometryDataTypes,
  },
  metadata: item.metadata || {},
});

export const mapLayerToDBFormat = (item) => ({
  reference_id: item.referenceId,
  geo_reference_id: item.geoReferenceId,
  layer_type: item.layerType,
  category: item.category,
  title: item.title,
  attribute_id: item.attributeData.attributeId,
  attribute_description: item.attributeDescription || {},
  styles: item.style || {},
  legend: item.legend || {},
  layer_options: item.layerOptions || {},
});

export const attributeTypeFromMapLayerType = (layerType: string) => {
  switch (layerType) {
    case 'points':
      return 'points';
    case 'regions':
      return 'region';
    default:
      return 'undefined';
  }
};
