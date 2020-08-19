/**
 * @name Test task project resolve
 * @desc Goes to the Site, Logs in, Changes profile
 */

require('dotenv').config()
const fs = require('fs');
const assert = require('assert');
const puppeteer = require('puppeteer-extra')
const MailGun = require('../src/MailGun');
const { screenshot, password, username } = require('../src/constants');
const delay = require('../src/helper')

let browser;
let page;

const options = {
  headless: false,
  userDataDir: './userMetaData',
}
before(async () => {
  const StealthPlugin = require('puppeteer-extra-plugin-stealth')
  puppeteer.use(StealthPlugin());

  browser = await puppeteer.launch(options);

  page = await browser.newPage();
});

describe('Test task example', () => {
  it('Logs in to the system and makes changes to profile', async () => {
    await page.goto('https://www.kijiji.ca/t-login.html', { waitUntil: 'networkidle2' });
    await delay(2000);
    await page.type('#emailOrNickname', username);
    await page.type('#password', password);
    await page.click("div[data-fes-id=\'authPage\'] button[type=\'submit\']");
    await page.waitForNavigation();

    await page.goto('https://www.kijiji.ca/t-settings.html', { waitUntil: 'networkidle2' });
    await page.waitForSelector('#PhoneNumber');
    await page.type('#PhoneNumber', '+380997859700');
    await page.type('#ProfileName', 'The Niko' + Date.now().toString().slice(2, 10));

    const checkbox = await page.$('input#sendFeatureNotificationEmail');
    const checkBoxValue = await (await checkbox.getProperty('checked')).jsonValue()
    assert(Boolean(checkBoxValue), true);
    await this.page.click(".button-task");

    await this.page.reload();
    await this.page.waitForSelector(".button-task");

  }).timeout(20000);
});

after(async () => {
  await page.screenshot({ path: screenshot });

  const attachments = [{ fileName: screenshot,
    content: fs.createReadStream(screenshot),
    contentType: 'image/png'}];

  await MailGun.fire(process.env.RECEIVER, 'Test task result - Niko', attachments);

  await browser.close();
});
