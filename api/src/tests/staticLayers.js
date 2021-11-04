const request = require('supertest');

const app = require('../config/express');
const LayerGeoData = require('../dbSchemas/layerGeoDataSchema');
const { MapLayer, GroupMapLayer } = require('../dbSchemas/mapLayersSchema');
const { mapLayersInDb, layerGeoDataInDb, mapLayerWithoutGeodata } = require('../testUtils/testData/staticLayers');

jest.mock('azure-storage');
jest.mock('../config/config.js', () => {
  return {
    authorizeTokenAttribute: false,
  };
});

describe('GET /api/staticLayers', () => {
  it('should return layer, even if no geojson data are in db', async () => {
    await MapLayer.create(mapLayerWithoutGeodata);

    const res = await request(app).get('/api/staticLayers/');
    expect(res.status).toEqual(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].referenceId).toEqual(mapLayerWithoutGeodata.referenceId);
    expect(res.body[0].category).toEqual(mapLayerWithoutGeodata.category);
    expect(res.body[0].title).toEqual(mapLayerWithoutGeodata.title);
  });

  it('should return all layers in db sorted by title', async () => {
    await LayerGeoData.create(layerGeoDataInDb);
    // saved in reverse order to check the sorting
    await MapLayer.create(mapLayersInDb[1]);
    await MapLayer.create(mapLayersInDb[0]);

    const res = await request(app).get('/api/staticLayers/');
    expect(res.status).toEqual(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0].geoReferenceId).toEqual(layerGeoDataInDb.referenceId);
    expect(res.body[0].referenceId).toEqual(mapLayersInDb[0].referenceId);
    expect(res.body[0].geoJSONUrl).toEqual(layerGeoDataInDb.geoJSONUrl);
  });

  it('should return layer of type group with correct geoJSON links in sublayers', async () => {
    await LayerGeoData.create(layerGeoDataInDb);
    await GroupMapLayer.create(mapLayersInDb[2]);

    const res = await request(app).get('/api/staticLayers/');
    expect(res.status).toEqual(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].referenceId).toEqual(mapLayersInDb[2].referenceId);
    res.body[0].layers.forEach((layer) => {
      expect(layer.geoJSONUrl).toEqual(layerGeoDataInDb.geoJSONUrl);
    });
  });
});
