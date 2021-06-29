const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (app) => {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8888',
    }),
  );
  app.use(
    '/MAP',
    createProxyMiddleware({
      target: 'http://localhost:8888',
    }),
  );
  app.use(
    '/SEARCH',
    createProxyMiddleware({
      target: 'http://localhost:8888',
    }),
  );
  app.use(
    '/oauth2',
    createProxyMiddleware({
      target: 'http://localhost:8888',
    }),
  );
  app.use(
    '/SATELLITE',
    createProxyMiddleware({
      target: 'http://localhost:8888',
    }),
  );
};
