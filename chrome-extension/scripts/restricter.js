/**
  * Getting domain names of restricted websites
  * @return {set} restricted domain names
  */
const getRestrictedSites = async () => {
  const sitesWrapper = await chrome.storage.local.get(["restrictedSites"]) || {}
  return sitesWrapper["restrictedSites"]
}

/**
 * Verify if the user is restricted
 * @return {boolean} True if restrictions are applied
 */ 
const isUserRestricted = async () => {
  const timestampRestrictionDate = await chrome.storage.local.get(["timestampRestrictionDate"])
  const timestamp = timestampRestrictionDate || Date.parse(0)
  const currentTimestamp = (new Date()).getTime()
  return timestamp > currentTimestamp
}

/**
 * Add a domain name at the restricted list
 * @param {string} domain name
 */
const addRestrictedSite = async (domain) => {
  const restrictedSites = getRestrictedSites() 
  restrictedSites[domain] = true
  await chrome.storage.local.set({"restrictedSites": restrictedSites})
}

function quizzPage() {
	const quizzHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Site Blocked</title>
    </head>
    <body>
      <h1>Site Blocked</h1>
    </body>
    </html>`
	document.body.innerHTML = quizzHTML	
}

