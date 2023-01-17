const puppeteer = require('puppeteer');

const entrySelector = 'a[href="/Menu/CrearMarcaje?Type_entrada=True"]';
const incidentEntrySelector = 'a[href="/Menu/SeleccionaIncidencia?Type_entrada=True"]';
const incidentEntryIframeSelector='iframe[src="/Menu/SeleccionaIncidencia?Type_entrada=True"]';
const incidentEntryFlexiworkingSelector = 'a[href="/Menu/CrearMarcaje?Type_entrada=True&incidencia_=1"]';


const exitSelector = 'a[href="/Menu/CrearMarcaje?Type_entrada=False"]';
const incidentExitSelector = 'a[href="/Menu/SeleccionaIncidencia?Type_entrada=False"]';
const incidentExitIframeSelector='iframe[src="/Menu/SeleccionaIncidencia?Type_entrada=False"]';
const incidentExitFlexiworkingSelector = 'a[href="/Menu/CrearMarcaje?Type_entrada=False&incidencia_=1"]';

const openConnection = async () => {
  console.log('----- INIT openConnection() -----');
  const browser = await puppeteer.launch({args: ['--incognito'],});
  return browser;
}

const openPage = async (browser,url) => {
  console.log(`----- INIT openPage(browser, url: ${url}) -----`);
  const page = await browser.newPage();
  await page.goto(url,{waitUntil: 'load'});
  return page;
}

const doLogin = async (page, user, password) => {
  console.log(`----- INIT doLogin(page, user: ${user}, password: ******) -----`);
  await page.type('#UserName', user);
  await page.type('#Password', password);
  await _clickOnSelector(page, 'input[type="submit"]');
}

const doEntry = async (page,incident) => {
  console.log(`----- INIT doEntry(page, incident: ${incident}) -----`);
  const selector = !incident ? entrySelector : incidentEntrySelector;
  await _validateLogin(page,selector);
  await _clickOnSelector(page,selector);
  if (incident) await _incidentClick(page,incidentEntryIframeSelector,incidentEntryFlexiworkingSelector);
}

const doExit = async (page,incident) => {
  console.log(`----- INIT doExit(page, incident: ${incident}) -----`);
  const selector = !incident ? exitSelector : incidentExitSelector;
  await _validateLogin(page,selector);
  await _clickOnSelector(page,selector);
  if (incident) await _incidentClick(page,incidentExitIframeSelector,incidentExitFlexiworkingSelector);
}

const _incidentClick = async (page,iframeSelector,selector) => {
  console.log(`----- INIT _incidentClick(page, iframeSelector: ${iframeSelector}, selector: ${selector}) -----`);
  const elementHandle = await page.waitForSelector(iframeSelector);
  const iframe = await elementHandle.contentFrame();
  await _clickOnSelector(iframe,selector);
}

const _clickOnSelector = async (page, selector) => {
  let element = await page.waitForSelector(selector);
  await element.click();
}

const _validateLogin = async (page, selector) => {
  await page.waitForSelector(selector)
  .then(() => {
    console.log(`----- _validateLogin OK -----`);
  })
  .catch(e => {
    console.log('LOGIN FAIL',e);
    process.exit(1);
  });
}

const closeConnection = async (browser) => {
  await browser.close();
}

module.exports = {
  openConnection,
  openPage,
  doLogin,
  doEntry,
  doExit,
  closeConnection
}