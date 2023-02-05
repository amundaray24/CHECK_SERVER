import { Router } from 'express';
import {body, check} from 'express-validator';

import { validateFields } from '../middleware/fields.validator.middleware.js';
import { createNotificationsConfiguration } from '../controllers/notification.controller.js';

const router = Router();

router.put('/',[
  body().isObject(),
  check('email','email - Invalid Mandatory Parameter').notEmpty().isEmail(),
  check("password","password - Invalid Mandatory Parameter").notEmpty(),
  check('itsEnabled','itsEnabled - Invalid Mandatory Parameter').notEmpty().isBoolean(),
  validateFields
],
createNotificationsConfiguration);

export default router;