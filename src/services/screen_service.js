const dialogSelector = 'div[role="dialog"]';

const generatePrintScreen = async (page) => {

  await page.waitForSelector(dialogSelector);

  return await page.screenshot({ 
    encoding: "base64",
    type: 'jpeg',
    fullPage: true
  });
}

module.exports = {
  generatePrintScreen
}