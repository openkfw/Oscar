import config from '../../config/config';
import { KnexConfig } from '../../types';

const knexConfig: KnexConfig = {
  development: {
    client: 'postgresql',
    connection: {
      host: config.postgresHost,
      port: 5432,
      database: config.postgresDb,
      user: config.postgresUser,
      password: config.postgresPassword,
      ssl: config.postgresSSL,
    },
    pool: {
      min: 2,
      max: 10,
    },
    useNullAsDefault: true,
  },
};

export default knexConfig;
