import express from 'express';
import utils from '../helpers/utils';
import { getAttributes, getAvailableDates, getUniqueFeatureIds } from '../database/attributes';
import { AvailableDate } from '../types';

const router = express.Router();

router.get(
  '/',
  utils.forwardError(async (req, res) => {
    const { limit, offset, dateStart, dateEnd, attributeIdCategory, featureId, latestValues } = req.query;
    const attributeId = decodeURIComponent(req.query.attributeId);
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
  utils.forwardError(async (req, res) => {
    let items: Array<AvailableDate> = [];
    items = await getAvailableDates(req.params.attributeId);
    res.send(items);
  }),
);

router.get(
  '/:attributeId/uniqueFeatures',
  utils.forwardError(async (req, res) => {
    let items: Array<string> = [];
    items = await getUniqueFeatureIds(req.params.attributeId);
    res.send(items);
  }),
);

export default router;
