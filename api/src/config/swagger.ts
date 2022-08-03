import swaggerValidation from 'openapi-validator-middleware';
import config from './config';

swaggerValidation.init(config.openApiSchemaFile || 'src/openapi/apiSchema.yml');

export default swaggerValidation;
