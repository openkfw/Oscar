import Joi from '@hapi/joi';
import { GEO_FORMATS, LAYER_TYPES } from './constants';

const metaDataFormat = Joi.object({
  description: Joi.string().allow('', null),
  sourceWebsite: Joi.string().allow('', null),
  sourceOrganisation: Joi.string().allow('', null),
  attributions: Joi.string().allow('', null),
  updateDate: Joi.string().allow('', null),
  updateFrequency: Joi.string().allow('', null),
  unit: Joi.string().allow('', null),
  reliabilityScore: Joi.string().allow('', null),
  dataRetrievalDescription: Joi.string().allow('', null),
  dataCalculationDescription: Joi.string().allow('', null),
});

export const geoDataConfigItem = Joi.object({
  name: Joi.string().required(),
  referenceId: Joi.string().required(),
  format: Joi.string()
    .required()
    .valid(...GEO_FORMATS),
  geometryDataTypes: Joi.string().valid(...LAYER_TYPES),
  featureIds: Joi.array().items(Joi.object({ property: Joi.string(), values: Joi.array().items(Joi.string()) })),
  attributeIds: Joi.array().items(Joi.string()),
  apiUrl: Joi.string(),
  geoDataUrl: Joi.string(),
  geoDataFilename: Joi.string(),
  createTable: Joi.string(),
  storeToTable: Joi.string(),
  storeToDb: Joi.boolean(), // is deprecated
  collectionName: Joi.string(), // is deprecated
  metadata: metaDataFormat,
});

export const geoDataConfig = Joi.array().items(geoDataConfigItem);
