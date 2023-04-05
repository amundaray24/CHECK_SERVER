import {response, request} from 'express';

import logger from '../config/check.logger.config.js';
import Holiday from '../models/holidays.model.js';
import {generateResponseError} from '../helpers/errors.generator.helper.js';

export const getHolidays = (req = request ,res = response) => {
  logger.info(`GET HOLIDAYS ${req.query}`);
  Holiday.find().then((holiday) => {
    logger.info(`HOLIDAYS: ${holiday}`);
    res.status(200).send({data: holiday});
  }).catch((err) => {
    logger.error('ERROR GETTING HOLIDAYS',err);
    generateResponseError(res,400,err);
  });
}

export const createHoliday = (req = request ,res = response) => {
  const { dates } = req.body;
  const documents = dates.map((date) => ({date}));
  logger.info(`CREATING HOLIDAYS ${dates}`);
  Holiday.insertMany(documents)
    .then((data) => {
      const response = data.map((holiday) => holiday._id);
      logger.info(`HOLIDAYS CREATED ${response}`);
      res.status(201).send({data: response});
    })
    .catch((err) => {
      logger.error('ERROR CREATING HOLIDAYS',err);
      generateResponseError(res,400,err);
    });
}

export const deleteHoliday = (req = request ,res = response) => {
  const { dates } = req.body;
  logger.info(`DELETING HOLIDAYS ${dates}`);
  Holiday.deleteMany({date:{$in:dates} })
    .then((data) => {
      logger.info(`HOLIDAYS DELETED: ${data.deletedCount}`);
      res.status(200).send({data : {deleted: data.deletedCount}});
    }).catch((err) => {
      logger.error('ERROR DELETING HOLIDAYS',err);
      generateResponseError(res,400,err);
    });
}

export const isHoliday = async (date) => {
  logger.info('VALIDATING HOLIDAY');
  return new Promise((resolve,reject) => {
    Holiday.findOne({date}).then((holiday) => {
      if (!holiday){
        logger.info(`LET'S WORK!! - ${date}`);
        resolve(false);
      } else {
        logger.info(`TODAY IT HOLIDAY!! - ${date}`);
        resolve(true);
      }
    }).catch((err) => {
      reject(err)
    });
  })
}