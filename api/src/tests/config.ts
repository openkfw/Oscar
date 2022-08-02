import request from 'supertest';

jest.mock('azure-storage');

describe('GET /api/config', () => {
  it('should return configuration for "Test" country', async () => {
    let app;
    jest.mock('../config/config.ts', () => {
      return {
        authorizeTokenAttribute: false,
      };
    });
    jest.isolateModules(() => {
      app = require('../config/express').default; // eslint-disable-line  global-require
    });
    const res = await request(app).get('/api/config');
    expect(res.status).toEqual(200);
  });
});
