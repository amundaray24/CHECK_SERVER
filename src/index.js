const argv = require('./config/yargs');
require('dotenv').config();

const {
  openConnection,
  openPage,
  doLogin,
  closeConnection,
  doEntry,
  doExit
} =  require('./services/check_service');

const user = process.env.FICHAJE_USER;
const password = process.env.FICHAJE_PASSWORD;
const url = process.env.FICHAJE_URL;

(async () => {

  if (!user || !password || !url) {
    console.log('.ENV FILE NOT CONFIGURED');
    console.log(`.env file config
      user: ${user}
      password: ${password ? '******' : password}
      url: ${url}`);
    process.exit(900);
  }

  const action = argv.a;
  const incident = argv.f;
  //CREATE NAV AND OPEN PAGE
  const browser = await openConnection();
  const page = await openPage(browser,url);
  await doLogin(page,user,password);

  if (action === 'OPEN') {
    await doEntry(page,incident);
  } else {
    await doExit(page,incident);
  }

  await closeConnection(browser);
})();

//TEST CODE
// const element = await page.waitForSelector('h2'); // select the element
// const value = await element.evaluate(el => el.textContent);
// console.log(value);