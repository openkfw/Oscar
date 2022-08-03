import express from 'express';
import swaggerValidation from '../config/swagger';
import utils from '../helpers/utils';
import { getAttributes, getAvailableDates, getUniqueFeatureIds } from '../database/attributes';
import { AvailableDate } from '../types';

const router = express.Router();

router.get(
  '/',
  swaggerValidation.validate,
  utils.forwardError(async (req, res) => {
    const { limit, offset, dateStart, dateEnd, attributeId, attributeIdCategory, featureId, latestValues } = req.query;

    const { items, count } = await getAttributes(
      { attributeId, attributeIdCategory, featureId, dateStart, dateEnd, latestValues },
      { limit, offset },
    );
    res.set('X-Total-Count', count);

    res.send(items);
  }),
);

router.get(
  '/:attributeId/availableDates',
  swaggerValidation.validate,
  utils.forwardError(async (req, res) => {
    let items: Array<AvailableDate> = [];
    items = await getAvailableDates(req.params.attributeId);
    res.send(items);
  }),
);

router.get(
  '/:attributeId/uniqueFeatures',
  swaggerValidation.validate,
  utils.forwardError(async (req, res) => {
    let items: Array<string> = [];
    items = await getUniqueFeatureIds(req.params.attributeId);
    res.send(items);
  }),
);

export default router;
