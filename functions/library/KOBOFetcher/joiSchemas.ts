import Joi from '@hapi/joi';

export const dbDataSchema = Joi.array().items(
  Joi.object({
    type: Joi.string().valid('Feature').required(),
    geometry: Joi.object()
      .keys({
        type: Joi.string().valid('Point').required(),
        coordinates: Joi.array().min(2).max(2).items(Joi.number()).required(),
      })
      .required(),
    properties: Joi.object()
      .keys({
        KOBO_uuid: Joi.string().uuid().required(),
        updatedDate: Joi.date().iso().required(),
        attributeId: Joi.string().required(),
      })
      .unknown(true)
      .required(),
  }),
);

export const itemFromUrlSchema = Joi.array().items(
  Joi.object({
    _uuid: Joi.string().uuid().required(),
    end: Joi.date().iso().required(),
  }).unknown(true),
);

export const surveySchema = Joi.object({
  name: Joi.string().required(),
  url: Joi.string().required(),
  assetId: Joi.string().required(),
  keyWithCoordinates: Joi.string().required(),
  selectedKeys: Joi.array().items(
    Joi.object({
      KOBO_question: Joi.string(),
      key: Joi.string(),
    }),
  ),
});
