import {response, request} from 'express';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

import Login from '../models/login.model.js'
import logger from '../config/check.logger.config.js';
import { generateResponseError } from '../helpers/errors.generator.helper.js';

export const createAuthSession = async (req = request ,res = response) => {
  const {user, password} = req.body;
  try {
    let passwordValid = false;
    let attemptsAvailable = false;
    const userModel = await Login.findOne({user});

    if (userModel) {
      if (userModel.attempts>0) {
        attemptsAvailable = true;
        passwordValid = bcryptjs.compareSync(password,userModel.password);
      }
    }
    
    if (!userModel || !passwordValid || !attemptsAvailable) {
      if (userModel && attemptsAvailable && !passwordValid ){
        await Login.findOneAndUpdate({user},{attempts: (userModel.attempts -1) });
      }
      logger.error(`ERROR IN LOGIN PROCESS | USER EXIST: ${userModel ? true : false} | PASSWORD VALID: ${passwordValid} | USER BLOCKED ${!attemptsAvailable}`);
      return generateResponseError(res,400,'USERS LOGIN FAILED');
    } 
    
    await Login.findOneAndUpdate({user},{attempts:3});

    const jwt = await _generateJwt(userModel._id);
    
    res.header('Authorization',jwt);

    logger.info(`LOGGED USER: ${user}`);

    res.json({
      authentication: {
        state: 'OK'
      }
    });
  } catch (error) {
    logger.error('ERROR IN LOGIN PROCESS',error);
    generateResponseError(res,500,'ERROR ON LOGIN PROCESS, PLEASE TRY AGAIN LATER');
  }
}

const _generateJwt = (uid = '') => {
  return new Promise((resolve,reject) => {
    const payload = {
      uid
    };

    jwt.sign(payload,process.env.CHECK_JWT_SECRET,{
      expiresIn: 300
    }, (err, token) => {
      if (err) {
        logger.error('ERROR GENERATING JWT', err);
        reject('ERROR GENERATING JWT');
      } else {
        resolve(token);
      }
    })
  })
}