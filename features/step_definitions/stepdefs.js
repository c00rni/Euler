import assert from 'assert';
import { Given, When, Then } from '@cucumber/cucumber';
import { normalizeUrl } from "../../chrome-extension/scripts/utils.js";
import { assertThat, is, falsy, equalTo, truthy } from 'hamjest'
import puppeteer from 'puppeteer';

const EXTENSION_PATH = './chrome-extension'
const EXTENSION_ID = 'ibllgoekmapepblnlnnicjpbnmemlbhg'

const browser = await puppeteer.launch({
  args: [
    `--disable-extensions-except=${EXTENSION_PATH}`,
    `--load-extension=${EXTENSION_PATH}`,
  ],
});


const page = await browser.newPage();
await page.setViewport({width: 1080, height: 1024})


Given('I am not authenticated', async function () {
	await page.goto(`chrome-extension://${EXTENSION_ID}/popup/popup.html`);

	const user = await page.evaluate(() => localStorage.getItem("user"))
	assertThat(user, is(falsy()))
});
       
When('I open the popup', function () {
	const popupUrl = `chrome-extension://${EXTENSION_ID}/popup/popup.html`
	const url = page.url()
	assertThat(popupUrl, equalTo(url))
});
       
Then('an authentication form is on the popup', async function () {
	const authenticationForm = await page.$('#authentificationForm')
	await browser.close()
	assertThat(authenticationForm && !authenticationForm.isHidden(), is(truthy()))
});
 
