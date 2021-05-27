const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compress = require('compression');
const httpStatus = require('http-status');
const expressWinston = require('express-winston');
const helmet = require('helmet');
const path = require('path');
const jwtDecode = require('jwt-decode');
const swaggerValidation = require('./swagger');

const winstonInstance = require('./winston');

const config = require('./config');
const routes = require('../routes/index');
const APIError = require('../helpers/APIError');

const app = express();

if (config.env === 'development') {
  app.use(morgan('dev'));
}

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// have health check defined before security
app.get('/health-check', (req, res) => {
  res.send('OK');
});

app.use(cookieParser());
app.use(compress());

// secure apps by setting various HTTP headers
app.use(helmet());

// enable detailed API logging in dev env
expressWinston.requestWhitelist.push('body');
expressWinston.responseWhitelist.push('body');
app.use(
  expressWinston.logger({
    winstonInstance,
    meta: false, // optional: log meta data about request (defaults to true)
    msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
    colorStatus: true, // Color the status code (default green, 3XX cyan, 4XX yellow, 5XX red).
  }),
);

// mount user authorization
if (config.authorizeTokenAttribute) {
  app.use((req, res, next) => {
    const header = req.headers.authorization;
    const token = header ? header.substring(6) : null;
    const decoded = token ? jwtDecode(token) : null;
    if (
      !decoded ||
      decoded[config.authorizationExpectedTokenAttribute] !== config.authorizationExpectedTokenAttributeValue
    ) {
      return res.sendStatus(403);
    }
    next();
  });
}

// mount all routes on /api path
app.use('/api', routes);

// catches 404 and forwards to error handler
app.use((req, res) => {
  // const err = new APIError('API not found', httpStatus.NOT_FOUND, true);
  // return next(err);
  const options = {
    root: path.join(path.dirname(require.main.filename), 'public'),
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true,
    },
  };

  res.sendFile('index.html', options);
});

app.use((err, req, res, next) => {
  if (err instanceof swaggerValidation.InputValidationError) {
    // logging the validation errors
    winstonInstance.error(err);
    return res.status(400).json({ more_info: JSON.stringify(err.errors) });
  }
  return next(err);
});

// converts error if it's not an instanceOf APIError
app.use((error, req, res, next) => {
  if (config.env !== 'test') {
    winstonInstance.error(error);
  }

  if (!(error instanceof APIError)) {
    const apiError = new APIError(error.message, error.status || httpStatus.INTERNAL_SERVER_ERROR, false);
    return next(apiError);
  }

  return next(error);
});

// error handler
// logs every error if not in test environment & sends stacktrace only during development
// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  res.status(error.status).json({
    message: error.isPublic ? error.message : error.status,
    stack: config.env === 'development' ? error.stack : {},
  });
});

module.exports = app;
