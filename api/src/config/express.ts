import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compress from 'compression';
import httpStatus from 'http-status';
import expressWinston from 'express-winston';
import helmet from 'helmet';
import path from 'path';
import jwtDecode from 'jwt-decode';
import swaggerValidation from './swagger';

import winstonInstance from './winston';

import config from './config';
import routes from '../routes/index';
import APIError from '../helpers/APIError';

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
    const apiError = new APIError(error.message, error.status || httpStatus.INTERNAL_SERVER_ERROR, false, undefined);
    return next(apiError);
  }

  return next(error);
});

// error handler
// logs every error if not in test environment & sends stacktrace only during development
// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
app.use((error, req, res, next) => {
  res.status(error.status).json({
    message: error.isPublic ? error.message : error.status,
    stack: config.env === 'development' ? error.stack : {},
  });
});

export default app;
