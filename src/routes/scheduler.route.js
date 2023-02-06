import { Router } from 'express';
import {body} from 'express-validator';

import { validateFields } from '../middleware/fields.validator.middleware.js';
import { createScheduler } from '../controllers/scheduler.controller.js';
import { validateHour } from '../middleware/times.validator.middleware.js';
import { validateJwt } from '../middleware/jwt.validator.middleware.js';

const router = Router();

router.put('/',[
  validateJwt,
  body().isArray().isLength({ min: 1 }),
  body('*.daysOfWeek', 'daysOfWeek must be an array and values in [MONDAY,TUESDAY,WEDNESDAY,THURSDAY,FRIDAY,SATURDAY,SUNDAY]').isArray().isLength({ min: 1 }).isIn(['MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY']),
  // body('*.entryHour', 'Please fill a valid Entry time between 07:00 and 09:59').notEmpty().isLength({ min: 4, max: 5 }).matches(/[7-9]{1}:[0-5]{1}[0-9]{1}/gm),
  // body('*.exitHour', 'Please fill a valid Entry time between 14:00 and 19:00').notEmpty().isLength({ min: 4, max: 5 }).matches(/1[4-9]{1}:[0-5]{1}[0-9]{1}/gm),
  body('*.entryHour', 'Please fill a valid Entry time between 00:00 and 23:59').notEmpty().isLength({ min: 4, max: 5 }).matches(/[0-9]{2}:[0-5]{1}[0-9]{1}/gm),
  body('*.exitHour', 'Please fill a valid Entry time between 00:00 and 23:59').notEmpty().isLength({ min: 4, max: 5 }).matches(/[0-9]{2}:[0-5]{1}[0-9]{1}/gm),
  validateHour,
  validateFields
],
createScheduler);

export default router;