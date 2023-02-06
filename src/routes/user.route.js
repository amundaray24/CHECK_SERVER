import { Router } from 'express';
import {body, check} from 'express-validator';

import { validateFields } from '../middleware/fields.validator.middleware.js';
import { createCheckUserConfiguration } from '../controllers/user.controller.js';
import { validateJwt } from '../middleware/jwt.validator.middleware.js';

const router = Router();

router.put('/',[
  validateJwt,
  body().isObject(),
  check('user','user - Invalid Mandatory Parameter').notEmpty(),
  check("password","password - Invalid Mandatory Parameter, must be have at least 8 character and contain At least one uppercase.At least one lower case.At least one special character. ").notEmpty().isLength({ min: 8 }).matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/),
  check('url','url - Invalid Mandatory Parameter').notEmpty().isURL(),
  validateFields
],
createCheckUserConfiguration);

export default router;