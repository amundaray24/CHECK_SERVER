require('dotenv').config();

const argv = require('./config/yargs');

const {
  openConnection,
  openPage,
  doLogin,
  closeConnection,
  doEntry,
  doExit
} =  require('./services/check_service');

const {
  validateHolidays
} = require('./services/holidays_service')

const user = process.env.FICHAJE_USER;
const password = process.env.FICHAJE_PASSWORD;
const url = process.env.FICHAJE_URL;
const holidays = process.env.FICHAJE_HOLIDAYS || '';

(async () => {

  if (!user || !password || !url) {
    console.log('.ENV FILE NOT CONFIGURED');
    console.log(`.env file config
      user: ${user}
      password: ${password ? '******' : password}
      url: ${url}`);
    process.exit(900);
  }

  console.log('----- INIT NEORIS CHECKING  -----');
  const action = argv.a;
  const incident = argv.f;

  console.log(`
    User: ${user}, 
    Password: ******,
    Url: ${url},
    Action: ${action},
    Incident: ${incident}
  `);

  validateHolidays(holidays)
    .then(async () => {
      console.log(`----- VALIDATION WHITOUT HOLIDAY -----`);
      //CREATE NAV AND OPEN PAGE
      const browser = await openConnection();
      const page = await openPage(browser,url);
      await doLogin(page,user,password);

      if (action === 'OPEN') {
        await doEntry(page,incident);
      } else {
        await doExit(page,incident);
      }
      console.log('----- CLOSING Connection -----');
      await closeConnection(browser);
      console.log('----- FINISH NEORIS CHECKING  -----');
    })
    .catch((date) => {
      console.log(`----- HOLIDAY  ${date} -----`);
    });
})();