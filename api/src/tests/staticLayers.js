const request = require('supertest');

const app = require('../config/express');
const LayerGeoData = require('../dbSchemas/layerGeoDataSchema');
const { MapLayer, GroupMapLayer } = require('../dbSchemas/mapLayersSchema');
const { mapLayersInDb, layerGeoDataInDb } = require('../testUtils/testData/staticLayers');

jest.mock('azure-storage');
jest.mock('../config/config.js', () => {
  return {
    authorizeTokenAttribute: false,
  };
});

describe('GET /api/staticLayers', () => {
  it('should return empty array, if no geojson data in db', async () => {
    await MapLayer.create(mapLayersInDb[0]);

    const res = await request(app).get('/api/staticLayers/');
    expect(res.status).toEqual(200);
    expect(res.body).toHaveLength(0);
  });
  it('should return all layers in db sorted by title with geoDataUrl and metadata from layerGeoData collection', async () => {
    await LayerGeoData.create(layerGeoDataInDb);
    // saved in reverse order to check the sorting
    await MapLayer.create(mapLayersInDb[1]);
    await MapLayer.create(mapLayersInDb[0]);

    const res = await request(app).get('/api/staticLayers/');
    expect(res.status).toEqual(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0].geoReferenceId).toEqual(layerGeoDataInDb.referenceId);
    expect(res.body[0].referenceId).toEqual(mapLayersInDb[0].referenceId);
    expect(res.body[0].geoDataUrl).toEqual(layerGeoDataInDb.geoDataUrl);
    expect(res.body[0].metadata).toEqual(layerGeoDataInDb.metadata);
  });
  it('should return layer of type group with correct geoJSON links and metadata in sublayers', async () => {
    await LayerGeoData.create(layerGeoDataInDb);
    await GroupMapLayer.create(mapLayersInDb[2]);

    const res = await request(app).get('/api/staticLayers/');
    expect(res.status).toEqual(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].referenceId).toEqual(mapLayersInDb[2].referenceId);
    res.body[0].layers.forEach((layer) => {
      expect(layer.geoDataUrl).toEqual(layerGeoDataInDb.geoDataUrl);
      expect(layer.metadata).toEqual(layerGeoDataInDb.metadata);
    });
  });
});
