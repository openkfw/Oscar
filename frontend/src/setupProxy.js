const { createProxyMiddleware } = require('http-proxy-middleware');

const API_IP = process.env.API_IP || 'localhost'

module.exports = (app) => {
  app.use(
    '/api',
    createProxyMiddleware({
      target: `http://${API_IP}:8888`,
    }),
  );
  app.use(
    '/MAP',
    createProxyMiddleware({
      target: `http://${API_IP}:8888`,
    }),
  );
  app.use(
    '/SEARCH',
    createProxyMiddleware({
      target: `http://${API_IP}:8888`,
    }),
  );
  app.use(
    '/oauth2',
    createProxyMiddleware({
      target: `http://${API_IP}:8888`,
    }),
  );
  app.use(
    '/SATELLITE',
    createProxyMiddleware({
      target: `http://${API_IP}:8888`,
    }),
  );
};
