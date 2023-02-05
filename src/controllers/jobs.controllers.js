
import logger from '../config/check.logger.config.js';
import { agenda, eventEmitter } from '../app.js';
import { calculateSchedulerCron } from './scheduler.controller.js'; 

export const jobScheduler = (newJobs) => {
  logger.info('NEW JOB SCHEDULE');

  const crontabExpressions = newJobs.map((schedule) => calculateSchedulerCron(schedule._id,schedule.daysOfWeek,schedule.entryHour,schedule.exitHour));
  
  agenda.purge();
  agenda.cancel({}).then(async () => {
    
    crontabExpressions.forEach( async(job) => {

      const nameEntryJob = `CALL_ENTRY_${job.id}`;
      const nameExitJob = `CALL_EXIT_${job.id}`;
  
      agenda.define(nameEntryJob,{concurrency:0}, async (job) => {
        logger.info(`INIT ${job.attrs.name} JOB`);
        eventEmitter.emit('INIT_CHECK_PROCESS','OPEN');
      });
    
      agenda.define(nameExitJob, {concurrency:0}, async (job) => {
        logger.info(`INIT ${job.attrs.name} JOB`);
        eventEmitter.emit('INIT_CHECK_PROCESS','CLOSE');
      });
  
      await agenda.every(job.entryCronExpression,nameEntryJob);
      await agenda.every(job.exitCronExpression, nameExitJob);
    });
  
    await agenda.start();
  });
}