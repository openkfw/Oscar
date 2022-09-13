import express from 'express';
import utils from '../helpers/utils';
import { getMapLayersWithGeoData } from '../database/layers';

const router = express.Router();

router.get(
  '/',
  utils.forwardError(async (req, res) => {
    const items = await getMapLayersWithGeoData();
    res.send(items);
  }),
);

export default router;
