import express from 'express';
import utils from '../helpers/utils';

import { getPointAttributes, getUniqueValues } from '../database/pointAttributes';

const router = express.Router();

router.get(
  '/',
  utils.forwardError(async (req, res) => {
    const { bottomLeft, topRight, attributeId, dateStart, dateEnd, lastDate, proj } = req.query;

    const attributes = await getPointAttributes(attributeId, bottomLeft, topRight, dateStart, dateEnd, lastDate, proj);

    if (attributes && attributes.length) {
      res.send({
        type: 'FeatureCollection',
        name: attributeId || 'pointAttributes',
        features: attributes.map((item) => ({ ...item, id: item._id })),
      });
      return;
    }
    res.send({
      type: 'FeatureCollection',
      name: attributeId || 'pointAttributes',
      features: [],
    });
  }),
);

router.get(
  '/:attributeId/unique/:property',
  utils.forwardError(async (req, res) => {
    let items: Array<any> | void = [];
    items = await getUniqueValues(req.params.attributeId, req.params.property);
    res.send(items);
  }),
);

export default router;
