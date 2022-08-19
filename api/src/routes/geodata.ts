import express from 'express';
import swaggerValidation from '../config/swagger';
import utils from '../helpers/utils';
import { getGeoData, getProperty, getUniqueValuesForProperty, getPropertySum } from '../database/geodata';

const router = express.Router();

router.get(
  '/:tableName',
  swaggerValidation.validate,
  utils.forwardError(async (req, res) => {
    const { bottomLeft, topRight, proj } = req.query;
    const { tableName } = req.params;

    const features = await getGeoData(tableName, bottomLeft, topRight, proj);
    if (features && features.length) {
      res.send({
        type: 'FeatureCollection',
        name: tableName,
        features,
      });
      return;
    }
    res.send({
      type: 'FeatureCollection',
      name: tableName,
      features: [],
    });
  }),
);

router.get(
  '/:tableName/properties/:propertyName',
  swaggerValidation.validate,
  utils.forwardError(async (req, res) => {
    const { tableName, propertyName } = req.params;

    const data = await getProperty(tableName, propertyName);

    res.send(data);
  }),
);

router.get(
  '/:tableName/uniqueProperties/:propertyName',
  swaggerValidation.validate,
  utils.forwardError(async (req, res) => {
    const { tableName, propertyName } = req.params;

    let dataArray = [];
    dataArray = await getUniqueValuesForProperty(tableName, propertyName);

    res.send(dataArray);
  }),
);

router.get(
  '/:tableName/properties/:propertyName/sum',
  swaggerValidation.validate,
  utils.forwardError(async (req, res) => {
    const { tableName, propertyName } = req.params;

    const data = await getPropertySum(tableName, propertyName);

    res.send(data);
  }),
);

export default router;
