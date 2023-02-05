import {response, request} from 'express';
import parser from 'cron-parser';

import logger from '../config/check.logger.config.js';
import Scheduler from '../models/scheduler.model.js';
import {generateResponseError} from '../helpers/errors.generator.helper.js';
import { eventEmitter } from '../app.js';

export const initScheduler = () => {
  Scheduler.find({})
    .then((data) => {
      eventEmitter.emit('NEW_CRONTAB_CONFIG', data);
    })
    .catch((err) => {
      logger.info('ERROR INITIALIZING SCHEDULER',err);
    });
}

export const createScheduler = (req = request ,res = response) => {
  const documents = req.body.map((schedule) => {
    const {daysOfWeek, entryHour, exitHour} = schedule;
    return {
      daysOfWeek,
      entryHour,
      exitHour
    }
  });
  Scheduler.deleteMany({}).then(() => {
    Scheduler.insertMany(documents).then((data) => {
      logger.info(`SCHEDULE CREATED ${data.map((schedule) => schedule._id)}`);
  
      eventEmitter.emit('NEW_CRONTAB_CONFIG', data );
  
      res.status(201).send({data});
    });
  }).catch((err) => {
    logger.error('ERROR CREATING SCHEDULE',err);
    generateResponseError(res,400,err);
  });
}

export const calculateSchedulerCron = (id,days,entryTime,exitTime) => {

  const equivalentWeekDay =  {
    MONDAY: 1,
    TUESDAY: 2,
    WEDNESDAY: 3,
    THURSDAY: 4,
    FRIDAY: 5,
    SATURDAY: 6,
    SUNDAY: 0
  }

  const equivalentDays = days.map((day) => equivalentWeekDay[day]);

  const [ entryHour, entryMinutes ] = entryTime.split(':');
  const [ exitHour, exitMinutes ] = exitTime.split(':');

  const entryCronExpression = _generateCronExpression(entryMinutes,entryHour,equivalentDays);
  const exitCronExpression = _generateCronExpression(exitMinutes,exitHour,equivalentDays);

  logger.debug(` GENERATING NEW CRON EXPRESSIONS
  DAYS ${equivalentDays}
  ENTRY TIME ${entryTime}
  CRON EXPRESSION ${entryCronExpression}
  EXIT TIME ${exitTime}
  CRON EXPRESSION ${exitCronExpression}
  `);

  return {
    id,
    entryCronExpression,
    exitCronExpression
  }
}

const _generateCronExpression = (minutes,hours,days) => {

  const entryCron = {
    second: [0],
    minute:[ Number(minutes)],
    hour: [Number(hours)],
    dayOfMonth: Array.from({length: 31}, (_, i) => i + 1),
    month: Array.from({length: 12}, (_, i) => i + 1),
    dayOfWeek:  days
  }

  return parser.fieldsToExpression(entryCron).stringify(); 
}