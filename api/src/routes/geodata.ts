import express from 'express';
import utils from '../helpers/utils';
import { getGeoData, getProperty, getUniqueValuesForProperty, getPropertySum } from '../database/geodata';

const router = express.Router();

router.get(
  '/:tableName',
  utils.forwardError(async (req, res) => {
    const { bottomLeft, topRight, proj, ...properties } = req.query;
    const { tableName } = req.params;

    const features = await getGeoData(tableName, bottomLeft, topRight, proj, properties);
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
  utils.forwardError(async (req, res) => {
    const { tableName, propertyName } = req.params;

    const data = await getProperty(tableName, propertyName);

    res.send(data);
  }),
);

router.get(
  '/:tableName/uniqueProperties/:propertyName',
  utils.forwardError(async (req, res) => {
    const { tableName, propertyName } = req.params;

    let dataArray = [];
    dataArray = await getUniqueValuesForProperty(tableName, propertyName);

    res.send(dataArray);
  }),
);

router.get(
  '/:tableName/properties/:propertyName/sum',
  utils.forwardError(async (req, res) => {
    const { tableName, propertyName } = req.params;

    const data = await getPropertySum(tableName, propertyName);

    res.send(data);
  }),
);

export default router;
