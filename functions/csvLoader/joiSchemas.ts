import Joi from '@hapi/joi';

export const dbDataSchema = Joi.array().items(
  Joi.object({
    date: Joi.date().iso().required(),
    featureId: Joi.string().required(),
    attributeId: Joi.string().required(),
    valueNumber: Joi.number(),
  }),
);

export const itemFromFileSchema = Joi.array();
