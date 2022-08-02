import swaggerValidation from 'openapi-validator-middleware';

swaggerValidation.init('src/openapi/apiSchema.yml');

export default swaggerValidation;
