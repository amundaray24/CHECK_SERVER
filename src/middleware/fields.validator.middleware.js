import { validationResult } from 'express-validator';
import { generateResponseError } from '../helpers/errors.generator.helper.js';

export const validateFields = (req,res,next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return generateResponseError(res,400,'Invalid Parameters',errors);
  }
  next();
}