import { createLogger, format, transports, Logger } from 'winston';
import config from './config';

const logger: Logger = createLogger({
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
