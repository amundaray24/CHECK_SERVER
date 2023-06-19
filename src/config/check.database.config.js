import mongoose from 'mongoose';

import logger from './check.logger.config.js';
import { eventEmitter } from '../app.js';

export const createConnection = async () => {

  const {
    CHECK_MONGO_USER,
    CHECK_MONGO_PASSWORD,
    CHECK_MONGO_DOMAIN,
    CHECK_MONGO_DATABASE,
  } = process.env;

  mongoose.set('strictQuery',true);
  await mongoose.connect(`mongodb+srv://${CHECK_MONGO_USER}:${CHECK_MONGO_PASSWORD}@${CHECK_MONGO_DATABASE}.${CHECK_MONGO_DOMAIN}/?retryWrites=true&w=majority`)
  .then(() => {
    logger.info('DATABASE CONNECTED');
    eventEmitter.emit('INIT_AGENDA_SCHEDULE');
  })
  .catch((err) => {
    logger.error('CONNECTION DATABASE ERROR',err);
    throw new Error('CONNECTION DATABASE ERROR');
  });
}