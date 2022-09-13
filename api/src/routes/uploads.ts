import express from 'express';
import utils from '../helpers/utils';
import { downloadBlobToResponse } from '../azureStorage/upload';
import config from '../config/config';

const router = express.Router();

router.get(
  '/geojsons/:fileName',
  utils.forwardError(async (req, res) => {
    const { fileName } = req.params;

    await downloadBlobToResponse(config.azureStorageLayerContainerName, fileName, res);
  }),
);

export default router;
