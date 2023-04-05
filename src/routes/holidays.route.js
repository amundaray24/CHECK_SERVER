import { Router } from 'express';
import {check, body} from 'express-validator';

import { validateFields } from '../middleware/fields.validator.middleware.js';
import { getHolidays, createHoliday, deleteHoliday } from '../controllers/holidays.controller.js';
import { validateDateVsToday } from '../middleware/times.validator.middleware.js';
import { validateJwt } from '../middleware/jwt.validator.middleware.js';

const router = Router();

router.get('/',[
  validateJwt,
],
getHolidays);

router.post('/',[
  validateJwt,
  body('dates').isArray().isLength({ min: 1 }),
  body("dates.*","dates - Invalid Mandatory Parameter").isISO8601('yyyy-mm-dd'),
  validateDateVsToday,
  validateFields
],
createHoliday);

router.delete('/',[
  validateJwt,
  check("dates","dates - Invalid Mandatory Parameter").isArray().isLength({ min: 1 }),
  validateFields
],
deleteHoliday);

export default router;