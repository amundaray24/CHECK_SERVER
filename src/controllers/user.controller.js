import {response, request} from 'express';

import logger from '../config/check.logger.config.js';
import User from '../models/user.model.js'
import {generateResponseError} from '../helpers/errors.generator.helper.js';

export const createCheckUserConfiguration = (req = request ,res = response) => {
  logger.info('CREATING USER');
  const {user, password, url} = req.body;
  const userModel = new User({user, password, url});
  Promise.all([
    User.deleteMany({}),
    userModel.save()
  ]).then((data) => {
    const response = data[1]
    logger.info(`USER CREATED ${response._id}`);
    res.status(201).send(response);
  })
  .catch((err) => {
    logger.error('ERROR CREATING USER',err);
    generateResponseError(res,400,err);
  });  
}

export const getCheckUserConfiguration = async () => {
  logger.info('GETTING USER');
  const user = await User.findOne();
  if (!user){
    logger.error('USER NOT FOUND');
    throw new Error('USER NOT FOUND');
  }
  logger.info(`USER TO CHECK { Url: ${user.url}, User: ${user.user}, Password: ****** }`);
  return user
}