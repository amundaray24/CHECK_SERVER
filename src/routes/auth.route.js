import { Router } from 'express';
import {body, check} from 'express-validator';

import { validateFields } from '../middleware/fields.validator.middleware.js';
import { createAuthSession } from '../controllers/auth.controller.js';
import { validateJwt } from '../middleware/jwt.validator.middleware.js';

const router = Router();

router.get('/validate',[validateJwt], (req,res) => {res.sendStatus(204)});

router.post('/',[
  body().isObject(),
  check('user','user - Invalid Mandatory Parameter').notEmpty(),
  check("password","password - Invalid Mandatory Parameter").notEmpty(),
  validateFields
],
createAuthSession);

export default router;