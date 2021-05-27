const { MapLayer } = require('../dbSchemas/mapLayersSchema');

const getMapLayers = async (filter) => {
  const items = await MapLayer.find(filter).sort({ title: 'asc' }).lean().exec();
  return items;
};

module.exports = { getMapLayers };
