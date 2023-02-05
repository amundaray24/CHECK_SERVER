import { Router } from 'express';
import {check} from 'express-validator';

import { validateFields } from '../middleware/fields.validator.middleware.js';
import { createOfficeDay, deleteOfficeDay } from '../controllers/office.day.controller.js';

const router = Router();

router.post('/',[
  check("dates","dates - Invalid Mandatory Parameter").isArray().isLength({ min: 1 }),
  validateFields
],
createOfficeDay);

router.delete('/',[
  check("dates","dates - Invalid Mandatory Parameter").isArray().isLength({ min: 1 }),
  validateFields
],
deleteOfficeDay);

export default router;