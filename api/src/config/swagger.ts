import swaggerValidation from 'openapi-validator-middleware';
import config from './config';

swaggerValidation.init(config.openApiSchemaFile);

export default swaggerValidation;
