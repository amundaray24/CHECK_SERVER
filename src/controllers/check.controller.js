import puppeteer from 'puppeteer';

import logger from '../config/check.logger.config.js';

import { eventEmitter } from '../app.js';
import { isHoliday } from './holidays.controller.js';
import { getCheckUserConfiguration } from './user.controller.js';
import { isOfficeDay } from './office.day.controller.js';


const loginSelector = 'a[href="/Login/Logout"]';
const dialogSelector = 'div[role="dialog"]';

const entrySelector = 'a[href="/Menu/CrearMarcaje?Type_entrada=True"]';
const homeOfficeEntrySelector = 'a[href="/Menu/SeleccionaIncidencia?Type_entrada=True"]';
const homeOfficeEntryIframeSelector='iframe[src="/Menu/SeleccionaIncidencia?Type_entrada=True"]';
const homeOfficeEntryFlexiworkingSelector = 'a[href="/Menu/CrearMarcaje?Type_entrada=True&incidencia_=1"]';

const exitSelector = 'a[href="/Menu/CrearMarcaje?Type_entrada=False"]';
const homeOfficeExitSelector = 'a[href="/Menu/SeleccionaIncidencia?Type_entrada=False"]';
const homeOfficeExitIframeSelector='iframe[src="/Menu/SeleccionaIncidencia?Type_entrada=False"]';
const homeOfficeExitFlexiworkingSelector = 'a[href="/Menu/CrearMarcaje?Type_entrada=False&incidencia_=1"]';


export const initCheckProcess = (action) => {
  const today = new Date().toISOString().split('T')[0];
  isHoliday(today)
    .then( async (isHoliday) => {
      if (isHoliday) {
        if (action==='OPEN') {
          const event = {
            action,
            today,
            isHoliday,
            isOfficeDay : undefined,
            status: true,
            screenshot: undefined
          }
          eventEmitter.emit('DISPATCH_EMAIL', event);
        }
      } else {
        const { url, user, password} = await getCheckUserConfiguration();
        isOfficeDay(today).then( isOfficeDay => {
          logger.info(`action: ${action}, Email: ${user}, OfficeDay: ${isOfficeDay}`);
          const event = {
            action,
            user,
            password,
            url,
            today,
            isOfficeDay
          }
          eventEmitter.emit('CHECK_PROCESS', event);
        });
      }
    })
    .catch((err) => {
      logger.error('ERROR ON VALIDATE HOLIDAY/OFFICE DAY',err);
    });
}


export const checkProcess = async (data) => {

  const {action, user, password, url, today, isOfficeDay} = data;

  const emailEvent = {
    action,
    today,
    isHoliday: false,
    isOfficeDay,
    status: undefined,
    screenshot: undefined
  }

  try {
    logger.info(`INIT CHECK PROCESS`);
    const browser = await _openConnection();
    const page = await _openPage(browser,url);
    await _doLogin(page,user,password);

    if (action === 'OPEN') {
     await _doEntry(page,isOfficeDay);
    } else {
     await _doExit(page,isOfficeDay);
    }

    logger.info('CAPTURE SCREEN PROCESS');
    const screenshot = await _generatePrintScreen(page);
    logger.info('CLOSING NAV CONNECTION');
    await _closeConnection(browser);
    logger.info('FINISH CHECK PROCESS');
    emailEvent.status = true;
    emailEvent.screenshot = screenshot;
    eventEmitter.emit('DISPATCH_EMAIL', emailEvent);
  } catch (err) {
    logger.error('ERROR ON CHECK PROCESS',err);
    emailEvent.status = false;
    eventEmitter.emit('DISPATCH_EMAIL', emailEvent);
  }
}

const _openConnection = async () => {
  logger.debug('INIT openConnection()');
  const browser = await puppeteer.launch({args: ['--incognito','--no-sandbox']});
  return browser;
}

const _openPage = async (browser,url) => {
  logger.debug(`INIT openPage(browser, url: ${url})`);
  const page = await browser.newPage();
  await page.goto(url,{waitUntil: 'load'});
  return page;
}

const _doLogin = async (page, user, password) => {
  logger.debug(`INIT doLogin(page, user: ${user}, password: ******)`);
  await page.type('#UserName', user);
  await page.type('#Password', password);
  await _clickOnSelector(page, 'input[type="submit"]');
}

const _doEntry = async (page,isOfficeDay) => {
  logger.debug(`INIT doEntry(page, isOfficeDay: ${isOfficeDay})`);
  await _validateLogin(page);
  const selector = isOfficeDay ? entrySelector : homeOfficeEntrySelector;
  logger.info(`SELECTOR: ${selector}`);
  await _clickOnSelector(page,selector);
  if (!isOfficeDay) await _homeOfficeClick(page,homeOfficeEntryIframeSelector,homeOfficeEntryFlexiworkingSelector);
}

const _doExit = async (page,isOfficeDay) => {
  logger.debug(`INIT doExit(page, isOfficeDay: ${isOfficeDay})`);
  await _validateLogin(page);
  const selector = isOfficeDay ? exitSelector : homeOfficeExitSelector;
  logger.info(`SELECTOR: ${selector}`);
  await _clickOnSelector(page,selector);
  if (!isOfficeDay) await _homeOfficeClick(page,homeOfficeExitIframeSelector,homeOfficeExitFlexiworkingSelector);
}

const _homeOfficeClick = async (page,iframeSelector,selector) => {
  logger.debug(`INIT _homeOfficeClick(page, iframeSelector: ${iframeSelector}, selector: ${selector})`);
  const elementHandle = await page.waitForSelector(iframeSelector);
  const iframe = await elementHandle.contentFrame();
  await _clickOnSelector(iframe,selector);
}

const _clickOnSelector = async (page, selector) => {
  logger.debug(`CLICK ON SELECTOR: ${selector}`);
  let element = await page.waitForSelector(selector);
  await element.click();
}

const _validateLogin = async (page) => {
  await page.waitForSelector(loginSelector)
  .then(() => {
    logger.debug(`LOGIN OK`);
  })
  .catch(err => {
    logger.error('LOGIN FAIL',err);
  });
}

const _generatePrintScreen = async (page) => {

  await page.waitForSelector(dialogSelector);

  return await page.screenshot({ 
    encoding: "base64",
    type: 'jpeg',
    fullPage: true
  });
}

const _closeConnection = async (browser) => {
  await browser.close();
}
