import { Router } from 'express';
import {body, check} from 'express-validator';

import { validateFields } from '../middleware/fields.validator.middleware.js';
import { createAuthSession } from '../controllers/auth.controller.js';

const router = Router();

router.post('/',[
  body().isObject(),
  check('user','user - Invalid Mandatory Parameter').notEmpty(),
  check("password","password - Invalid Mandatory Parameter").notEmpty(),
  validateFields
],
createAuthSession);

export default router;