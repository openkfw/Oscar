import express from 'express';
import dataLayers from './dataLayers';
import attributes from './attributes';
import pointAttributes from './pointAttributes';
import geodata from './geodata';
import uploads from './uploads';
import authorization from './authorization';
import config from './config';

const router = express.Router();

router.use('/dataLayers', dataLayers);
router.use('/staticLayers', dataLayers);
router.use('/attributes', attributes);
router.use('/pointAttributes', pointAttributes);
router.use('/geodata', geodata);
router.use('/uploads', uploads);
router.use('/authorization', authorization);
router.use('/config', config);

export default router;
