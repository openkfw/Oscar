import express from 'express';
import swaggerValidation from '../config/swagger';
import utils from '../helpers/utils';

import { getPointAttributes, getUniqueValues } from '../database/pointAttributes';

const router = express.Router();

router.get(
  '/',
  swaggerValidation.validate,
  utils.forwardError(async (req, res) => {
    const { bottomLeft, topRight, attributeId, dateStart, dateEnd, lastDate } = req.query;

    const attributes = await getPointAttributes(attributeId, bottomLeft, topRight, dateStart, dateEnd, lastDate);

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
  swaggerValidation.validate,
  utils.forwardError(async (req, res) => {
    let items: Array<any> | void = [];
    items = await getUniqueValues(req.params.attributeId, req.params.property);
    res.send(items);
  }),
);

export default router;
