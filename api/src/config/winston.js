const { createLogger, format, transports } = require('winston');
const { logLabel } = require('./config');

const logger = createLogger({
  level: 'debug',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.errors({ stack: true }),
    format.colorize(),
    format.splat(),

    format.simple(),
    // format.json(),
  ),
  defaultMeta: { service: logLabel },
  transports: [new transports.Console()],
});

module.exports = logger;
