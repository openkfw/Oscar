import winston from 'winston';
import config from './config';

const { combine, timestamp, label, printf } = winston.format;

const logFormat = printf((info) => `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`);

const logger = winston.createLogger({
  format: combine(label({ label: config.logLabel }), timestamp(), logFormat),
  transports: [new winston.transports.Console()],
});
export default logger;
