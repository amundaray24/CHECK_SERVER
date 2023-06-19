import Agenda from 'agenda';

import logger from '../config/check.logger.config.js';

export const createAgendaConfiguration = () => {
  const {
    CHECK_MONGO_USER,
    CHECK_MONGO_PASSWORD,
    CHECK_MONGO_DOMAIN,
    CHECK_MONGO_DATABASE
  } = process.env;

  const mongoConnectionString = `mongodb+srv://${CHECK_MONGO_USER}:${CHECK_MONGO_PASSWORD}@${CHECK_MONGO_DOMAIN}/${CHECK_MONGO_DATABASE}?retryWrites=true&w=majority`;
  logger.info('CREATING AGENDA INSTANCE');
  return new Agenda({ db: { address: mongoConnectionString , collection: "CHECK_AGENDA_JOBS"} });
}