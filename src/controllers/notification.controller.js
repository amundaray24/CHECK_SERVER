import {response, request} from 'express';

import logger from '../config/check.logger.config.js';
import NotificationModel from '../models/notifications.model.js';
import { getEmailClient } from '../config/check.smtp.config.js';
import {generateResponseError} from '../helpers/errors.generator.helper.js';

export const createNotificationsConfiguration = (req = request ,res = response) => {
  logger.info('CREATING NOTIFICATIONS');
  const {email, password, itsEnabled} = req.body;
  const notification = new NotificationModel({email, password, itsEnabled});
  Promise.all([
    NotificationModel.deleteMany({}),
    notification.save()
  ]).then((data) => {
    const response = data[1]
    logger.info(`NOTIFICATIONS CREATED ${response._id}`);
    res.status(201).send(response);
  })
  .catch((err) => {
    logger.error('ERROR CREATING NOTIFICATIONS',err);
    generateResponseError(res,400,err);
  });  
}

export const sendNotification = async ( date, action, isHoliday, isOfficeDay, status, screenshot) => {
  try {
    const {email, password, itsEnabled} = await _getCheckNotificationConfiguration();
    if (!itsEnabled) {
      logger.info('DISABLED NOTIFICATIONS');
      return;
    }
    const template = _generateTemplate(date,action, isHoliday, isOfficeDay,status);
    const emailClient = getEmailClient(email,password);
    
    let attachments = [
      {
        filename: `${action}_CHECK_${date}.log`,
        path: `/usr/app/logs/CHECK_${date}.log`
      }
    ]

    if (screenshot) {
      attachments.push({ 
        filename: 'evidence.jpeg',
        content: screenshot,
        encoding: 'base64'
      });
    }

    emailClient.sendMail({
      from: email || 'email@prueba.com', 
      to: email,
      subject: `{CHECK} ${isHoliday && status ? 'HOLIDAY!! 🚀🚀🚀🚀' : status ? ' NOTIFICATIONS!! ✅✅✅✅' : 'ERROR!! ⛔⛔⛔⛔'}`,
      html: template,
      attachments
    }).then(info => {
      logger.debug(JSON.stringify(info));
      logger.info('FINISH SEND_EMAIL');
    });
  } catch (err) {
    logger.error('ERROR SENDING EMAIL',err);
  }
}

const _getCheckNotificationConfiguration = async () => {
  logger.info('GETTING NOTIFICATION');
  const notification = await NotificationModel.findOne();
  if (!notification){
    logger.error('EMAIL NOT FOUND');
    throw new Error('EMAIL NOT FOUND');
  }
  logger.info(`EMAIL TO NOTIFICATION { email: ${notification.email}, Password: ****** }`);
  return notification
}

const _generateTemplate = (date, action, isHoliday, isOfficeDay, status) => {
  return  `
  <div dir=3D"ltr">
    <div><b>Notificación de Fichaje:</b></div>
    <br><br>
    <div><b>DATE: </b> ${date}</div>
    <div><b>ACTION: </b>${action}</div>
    ${isHoliday ? '<div><b>IT\'S HOLIDAY </b></div>' : '<div><b>LET\'S WORK!! </b></div>'}
    ${isOfficeDay && !isHoliday ? '<div><b>IT\'S OFFICE DAY </b></div>' : !isOfficeDay && !isHoliday ? '<div><b>HOME OFFICE DAY </b></div>' : ''}
    <div><b>STATUS: </b>${status}</div>
    <br>
    <div>Log attached</div>
  </div>
  `
}