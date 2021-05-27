const swaggerValidation = require('openapi-validator-middleware');

swaggerValidation.init('src/openapi/apiSchema.yml');

module.exports = swaggerValidation;
