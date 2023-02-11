import logger from '../config/check.logger.config.js';

import { generateResponseError } from '../helpers/errors.generator.helper.js';

// CUSTOM 404 ERROR HANDLER
export const defaultError404 = (req, res) => {
  logger.warn(`INVALID PATH REQUEST ${req.originalUrl}`);
  generateResponseError(res,404,'Sorry can\'t find that!');
}

// CUSTOM 404 ERROR HANDLER
export const defaultError500 = (err,req, res,) => {
  logger.error(`UNHANDLED ERROR ON ${req.originalUrl}`,err);
  generateResponseError(res,500,'Something broke!');
}