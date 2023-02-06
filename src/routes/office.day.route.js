import { Router } from 'express';
import {check} from 'express-validator';

import { createOfficeDay, deleteOfficeDay } from '../controllers/office.day.controller.js';
import { validateFields } from '../middleware/fields.validator.middleware.js';
import { validateJwt } from '../middleware/jwt.validator.middleware.js';

const router = Router();

router.post('/',[
  validateJwt,
  check("dates","dates - Invalid Mandatory Parameter").isArray().isLength({ min: 1 }),
  validateFields
],
createOfficeDay);

router.delete('/',[
  validateJwt,
  check("dates","dates - Invalid Mandatory Parameter").isArray().isLength({ min: 1 }),
  validateFields
],
deleteOfficeDay);

export default router;