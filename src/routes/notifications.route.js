import { Router } from 'express';
import {body, check} from 'express-validator';

import { createNotificationsConfiguration } from '../controllers/notification.controller.js';
import { validateFields } from '../middleware/fields.validator.middleware.js';
import { validateJwt } from '../middleware/jwt.validator.middleware.js';

const router = Router();

router.put('/',[
  validateJwt,
  body().isObject(),
  check('email','email - Invalid Mandatory Parameter').notEmpty().isEmail(),
  check("password","password - Invalid Mandatory Parameter").notEmpty(),
  check('itsEnabled','itsEnabled - Invalid Mandatory Parameter').notEmpty().isBoolean(),
  validateFields
],
createNotificationsConfiguration);

export default router;