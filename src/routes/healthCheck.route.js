import {Router, response, request} from 'express';
import { generateResponseError } from '../helpers/errors.generator.helper.js';

const router = Router();

router.get('/',async (req = request ,res = response) => {
  const healthCheck = {
    url: req.originalUrl,
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now()
  };
  try {
    res.send(healthCheck);
  } catch (error) {
    healthCheck.message = error;
    generateResponseError(res,500,healthCheck);
  }
});

export default router;