import assert from 'assert';
import { Given, When, Then, Before, After} from '@cucumber/cucumber';
import { assertThat, is, falsy, equalTo, truthy } from 'hamjest'
import puppeteer from 'puppeteer';

const EXTENSION_PATH = './chrome-extension'
const EXTENSION_ID = 'ibllgoekmapepblnlnnicjpbnmemlbhg'

Before(async function () {
	this.browser = await puppeteer.launch({
	  args: [
	    `--disable-extensions-except=${EXTENSION_PATH}`,
	    `--load-extension=${EXTENSION_PATH}`,
	  ],
	});
	this.page = await this.browser.newPage();
	await this.page.setViewport({width: 1080, height: 1024})

})


Given('I am not authenticated', async function () {
	await this.page.goto(`chrome-extension://${EXTENSION_ID}/popup/popup.html`);

	const user = await this.page.evaluate(() => localStorage.getItem("user"))
	assertThat(user, is(falsy()))
});
       
When('I open the popup', function () {
	const popupUrl = `chrome-extension://${EXTENSION_ID}/popup/popup.html`
	const url = this.page.url()
	assertThat(popupUrl, equalTo(url))
});
       
Then('the authentication form is visible', async function () {
	const authenticationForm = await this.page.$('#authentificationForm')
	assertThat(authenticationForm && ! await authenticationForm.isHidden(), is(truthy()))
});

Then('the authentication form is not visible', async function () {
	const authenticationForm = await this.page.$('#authentificationForm')
	assertThat(authenticationForm && await authenticationForm.isHidden(), is(truthy()))
});
 
Then('the restriction form is not visible', async function () {
	const restrictionForm = await this.page.$('#addUrlForm')
	assertThat(restrictionForm && await restrictionForm.isHidden(), is(truthy()))
});

Then('the remove form is not visible', async function () {
	const removeForm = await this.page.$('#removeUrlForm')
	assertThat(removeForm && await removeForm.isHidden(), is(truthy()))
});


After(async function () {
	await this.browser.close()
})
