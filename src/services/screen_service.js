const loginSelector = 'a[href="/Login/Logout"]';

const generatePrintScreen = async (page) => {

  await page.waitForSelector(loginSelector);

  return await page.screenshot({ 
    encoding: "base64",
    type: 'jpeg',
    fullPage: true
  });
}

module.exports = {
  generatePrintScreen
}