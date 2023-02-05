import Agenda from 'agenda';

import logger from '../config/check.logger.config.js';

export const createAgendaConfiguration = () => {
  const {
    CHECK_MONGO_USER,
    CHECK_MONGO_PASSWORD,
    CHECK_MONGO_DOMAIN,
    CHECK_MONGO_DATABASE,
    CHECK_MONGO_PORT,
  } = process.env;

  const mongoConnectionString = `mongodb://${CHECK_MONGO_USER}:${CHECK_MONGO_PASSWORD}@${CHECK_MONGO_DOMAIN}:${CHECK_MONGO_PORT}/${CHECK_MONGO_DATABASE}`;
  logger.info('CREATING AGENDA INSTANCE');
  return new Agenda({ db: { address: mongoConnectionString , collection: "CHECK_AGENDA_JOBS"} });
}