const winston = require('winston');
const config = require('./config');

const { combine, timestamp, label, printf } = winston.format;

const logFormat = printf((info) => `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`);

const logger = winston.createLogger({
  format: combine(label({ label: config.logLabel }), timestamp(), logFormat),
  transports: [new winston.transports.Console()],
});

module.exports = logger;
