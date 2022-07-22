export const DBFormatToMapLayerWithGeoData = (item) => ({
  referenceId: item.reference_id,
  geoReferenceId: item.geo_reference_id || null,
  layerType: item.layer_type,
  category: item.category,
  title: item.title,
  attributeId: item.attribute_id || null,
  attribute: item.attribute_id || null, // attribute property is here for legacy and consistency
  attributeDescription: item.attribute_description || null,
  style: item.style || null,
  legend: item.legend || null,
  layerOptions: item.layer_options || {},
  layers: item.layers || null,
  createdAt: item.created_at,
  updatedAt: item.updated_at,
  format: item.format || 'geojson', // no other formats supported yet
  geoDataUrl: item.geo_data_url,
  metadata: item.metadata || {},
});

export default { DBFormatToMapLayerWithGeoData };
