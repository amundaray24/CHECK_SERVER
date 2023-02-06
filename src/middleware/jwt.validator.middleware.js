import {response, request} from 'express';
import jwt from 'jsonwebtoken';

import Login from '../models/login.model.js'
import logger from '../config/check.logger.config.js';
import { generateResponseError } from '../helpers/errors.generator.helper.js';

export const validateJwt = (req = request, res=response, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return generateResponseError(res,401,'Authorization Token not sended');
  }
  try {
    const {uid} = jwt.verify(token,process.env.CHECK_JWT_SECRET);
    Login.findById({_id:uid}).then((data) => {
      if (data) {
        const {password,__v, ...rest } = data._doc;
        req.context = {user:rest};
        next();
      } else {
        logger.error('INVALID USER TOKEN');
        generateResponseError(res,401,'Invalid Authorization Token');
      }
    });
  } catch (err) {
    logger.error('INVALID AUTHORIZATION TOKEN',err);
    generateResponseError(res,401,'Invalid Authorization Token');    
  }
}