import {response, request} from 'express';

import logger from '../config/check.logger.config.js';
import Office from '../models/office.model.js';
import {generateResponseError} from '../helpers/errors.generator.helper.js';

export const createOfficeDay = (req = request ,res = response) => {
  const { dates } = req.body;
  const documents = dates.map((date) => ({date}));
  logger.info(`CREATING OFFICE DAY ${dates}`);
  Office.insertMany(documents)
    .then((data) => {
      const response = data.map((holiday) => holiday._id);
      logger.info(`OFFICE DAY CREATED ${response}`);
      res.status(201).send({data: response});
    })
    .catch((err) => {
      logger.error('ERROR CREATING OFFICE DAY',err);
      generateResponseError(res,400,err);
    });
}

export const deleteOfficeDay = (req = request ,res = response) => {
  const { dates } = req.body;
  logger.info(`DELETING OFFICE DAY ${dates}`);
  Office.deleteMany({date:{$in:dates} })
    .then((data) => {
      logger.info(`OFFICE DAY DELETED: ${data.deletedCount}`);
      res.status(200).send({data : {deleted: data.deletedCount}});
    }).catch((err) => {
      logger.error('ERROR DELETING OFFICE DAY',err);
      generateResponseError(res,400,err);
    });
}


export const isOfficeDay = async (date) => {
  logger.info('VALIDATING OFFICE_DAY');
  return new Promise((resolve,reject) => {
    Office.findOne({date}).then((officeDay) => {
      if (!officeDay){
        logger.info(`TODAY IS HOME OFFICE!! - ${date}`);
        resolve(false);
      } else {
        logger.info(`TODAY IS OFFICE DAY!! - ${date}`);
        resolve(true);
      }
    }).catch((err) => {
      reject(err)
    });
  })
}