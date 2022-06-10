import { createLogger, format, transports } from 'winston';
import config from './config';

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
  defaultMeta: { service: config.logLabel },
  transports: [new transports.Console()],
});

export default logger;
