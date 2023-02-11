import express from 'express';
import cors from 'cors';
import EventEmitter from 'events';
import helmet from 'helmet';

import logger from './config/check.logger.config.js';

import { createConnection } from './config/check.database.config.js';
import { configureEvents } from './controllers/events.controller.js';
import { createAgendaConfiguration } from './config/check.agenda.config.js';

import holidayRoute from './routes/holidays.route.js';
import officeDayRoute from './routes/office.day.route.js';
import schedulerRoute from './routes/scheduler.route.js';
import userRoute from './routes/user.route.js';
import notificationRoute from './routes/notifications.route.js';
import authenticationRoute from './routes/auth.route.js';
import healthCheckRoute from './routes/healthCheck.route.js';
import { defaultError404, defaultError500 } from './middleware/default.errors.handler.middleware.js';
import { checkRateLimiter } from './middleware/rate.limiter.middleware.js';

export const eventEmitter = new EventEmitter();
export const agenda = createAgendaConfiguration();

export class App {

  constructor() {

    this.app = express();
    this.app.disable('x-powered-by');
    this.port = process.env.CHECK_PORT || 3000;

    //Routes declarations
    this.paths = [
      {
        path: '/holidays/v1/holidays',
        route: holidayRoute
      },
      {
        path: '/office/v1/office',
        route: officeDayRoute
      },
      {
        path: '/scheduler/v1/scheduler',
        route: schedulerRoute
      },
      {
        path: '/user/v1/user',
        route: userRoute
      },
      {
        path: '/notification/v1/notification',
        route: notificationRoute
      },
      {
        path: '/authentication/v1/authentication',
        route: authenticationRoute
      },
      {
        path: '/health/check',
        route: healthCheckRoute
      }
    ]

    //Database Connection
    this.databaseConnect();
    //Events Handler
    this.eventsConfig();
    //Middleware's
    this.middleware();
    //Routes
    this.routes();
  }

  databaseConnect() {
    createConnection();
  }

  eventsConfig() {
    configureEvents();
  }

  middleware() {
    //Cors
    this.app.use(cors());
    //Helmet
    this.app.use(helmet());
    //Rate limiter
    this.app.use(checkRateLimiter);
    //Json Parser
    this.app.use(express.json());
  }

  routes() {
    this.paths.forEach(async (routeItem) => {
      this.app
      this.app.use(routeItem.path , routeItem.route);
    });
    this.app.use(defaultError404);
    this.app.use(defaultError500);
  }

  start() {
    this.app.listen(this.port, () => {
      logger.info(`INFO - Listening at http://0.0.0.0:${this.port}`);
    });
  }
}