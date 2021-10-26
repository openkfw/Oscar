import Joi from '@hapi/joi';

export const dbDataSchema = Joi.array().items(
  Joi.object({
    date: Joi.date().iso().required(),
    featureId: Joi.string().required(),
    attributeId: Joi.string().required(),
    valueNumber: Joi.number(),
  }),
);

export const configSchema = Joi.object({
  calculatedAttribute: Joi.string().required(),
  databaseCollection: Joi.string().required(),
  dailyCasesBaseAttribute: Joi.string().required(),
  populationBaseAttribute: Joi.string().required(),
  countryLevel0: Joi.string().required(),
  countryLevel1: Joi.string().required(),
  countryLevel2: Joi.string().required(),
});

export default { dbDataSchema };
