import { generateResponseError } from '../helpers/errors.generator.helper.js';

export const validateDateVsToday = (req,res,next) => {
  
  let today = new Date();
  today = Date.UTC(today.getFullYear(),today.getMonth(), today.getDate())

  let errors = false;

  req.body.dates.forEach(date => {
    let dateProcessed = new Date( date + 'T00:00:00+0000');
    date = Date.UTC(dateProcessed.getFullYear(),dateProcessed.getMonth(), dateProcessed.getDate());  
    if (date < today) {
      errors = true;
    }
  });
  if (errors) {
    return generateResponseError(res,400,'Invalid Parameters, dates must be major than today');
  } else {
    next();
  }
}

export const validateHour = (req,res,next) => {

  let error = undefined;

  req.body.forEach( schedule => {
    const entryHour = schedule.entryHour.split(':');
    const exitHour = schedule.exitHour.split(':');
    const baseDate = new Date();
    const entry = Date.UTC(baseDate.getFullYear(),baseDate.getMonth(), baseDate.getDate(),entryHour[0],entryHour[1],Number('00'));
    const exit = Date.UTC(baseDate.getFullYear(),baseDate.getMonth(), baseDate.getDate(),exitHour[0],exitHour[1],Number('00'));
    if (exit < entry) error={entryHour: schedule.entryHour, exitHour: schedule.exitHour};
  });
  if (error) {
    return generateResponseError(res,400,`Invalid Parameters, exitHour ${error.exitHour} must be major than entryHour ${error.entryHour}`);
  } else {
    next();
  }
}