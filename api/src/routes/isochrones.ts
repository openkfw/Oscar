import express from 'express';
import utils from '../helpers/utils';

import { getIsochronesByPointsSource } from '../actions/isochrones';

const router = express.Router();

router.get(
  '/',
  utils.forwardError(async (req, res) => {
    const { bottomLeft, topRight, pointsSource } = req.query;

    const itemsArrays = await getIsochronesByPointsSource(pointsSource, bottomLeft, topRight);

    const items = itemsArrays; // .length ? itemsArrays.flat() : [];

    const featureCollection = {
      type: 'FeatureCollection',
      name: 'Isochrone for point attribute',
      crs: {
        type: 'name',
        properties: {
          name: 'urn:ogc:def:crs:OGC:1.3:CRS84',
        },
      },
      features: items,
    };
    res.send(featureCollection);
  }),
);

export default router;
