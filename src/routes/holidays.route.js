import { Router } from 'express';
import {check, body} from 'express-validator';

import { validateFields } from '../middleware/fields.validator.middleware.js';
import { createHoliday, deleteHoliday } from '../controllers/holidays.controller.js';
import { validateDateVsToday } from '../middleware/times.validator.middleware.js';

const router = Router();

router.post('/',[
  body('dates').isArray().isLength({ min: 1 }),
  body("dates.*","dates - Invalid Mandatory Parameter").isISO8601('yyyy-mm-dd'),
  validateDateVsToday,
  validateFields
],
createHoliday);

router.delete('/',[
  check("dates","dates - Invalid Mandatory Parameter").isArray().isLength({ min: 1 }),
  validateFields
],
deleteHoliday);

export default router;