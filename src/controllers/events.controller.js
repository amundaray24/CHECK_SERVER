
import logger from '../config/check.logger.config.js';
import { eventEmitter } from '../app.js';
import { jobScheduler } from './jobs.controllers.js';
import { initScheduler } from './scheduler.controller.js';
import { initCheckProcess, checkProcess } from './check.controller.js';
import { sendNotification } from './notification.controller.js';

export const configureEvents = () => {
  
  eventEmitter.on('INIT_AGENDA_SCHEDULE',() => {
    logger.debug('event "INIT_AGENDA_SCHEDULE" Captured');
    initScheduler();
  });

  eventEmitter.on('NEW_CRONTAB_CONFIG',(schedulers) => {
    logger.debug('event "NEW_CRONTAB_CONFIG" Captured');
    jobScheduler(schedulers);
  });

  eventEmitter.on('INIT_CHECK_PROCESS',(action) => {
    logger.debug('event "INIT_CHECK_PROCESS" Captured');
    initCheckProcess(action);
  });

  eventEmitter.on('CHECK_PROCESS',(action) => {
    logger.debug('event "CHECK_PROCESS" Captured');
    checkProcess(action);
  });

  eventEmitter.on('DISPATCH_EMAIL',(notification) => {
    const {action, today, isHoliday, isOfficeDay, status,screenshot} = notification;
    logger.debug('event "DISPATCH_EMAIL" Captured');
    sendNotification(today, action, isHoliday, isOfficeDay, status, screenshot);
  });

}