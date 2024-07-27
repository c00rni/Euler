/**
 * Normalize URL
 * @param {string} url 
 * @return {string} The domain name of the url
 */
function normalizeUrl(rawUrl) {
	let url;
	if (!rawUrl.includes("https://") && !rawUrl.includes("http://")) {
		rawUrl = `https://${rawUrl}`
	}

	try {
		url = new URL(rawUrl)
		console.log(url)
	}
	catch(err) {
		throw new Error(`the input: ${rawUrl} failed to normalize: ${err.message}`)
	}
	
	return url.hostname
}

function addWebsite(url) {
	try {
		const domain = normalizeUrl(url)
		const restrictedSites = JSON.parse(localStorage.getItem("restrictedSites")) || {}
		restrictedSites[domain] = true
		localStorage.setItem("restrictedSites", JSON.stringify(restrictedSites))
	} catch(error) {
		console.log(error.message)
		return false
	}
	return true
}

function removeWebsite(url) {
	try {
		const domain = normalizeUrl(url)
		const restrictedSites = JSON.parse(localStorage.getItem("restrictedSites")) || {} 
		
		const sites = {}
		for (const site in restrictedSites) {
			if (site != domain) {
				console.log()
				sites[site] = true
			}
		}
		console.log(restrictedSites)
		localStorage.setItem("restrictedSites", JSON.stringify(sites))
	} catch(error) {
		console.log(error.message)
		return false
	}
	return true
}


document.getElementById('removeUrlForm').addEventListener('submit',function (event) {
	event.preventDefault();
	let url = document.getElementById('removeUrlInput').value;
	if(removeWebsite(url)) {
		removeMessage.textContent = `${url} have been remove.`
	} else {
		removeMessage.textContent = `The url can't be remove.`
	}
})

const removeMessage = document.getElementById('removeMessage')
const addMessage = document.getElementById('addMessage')
document.getElementById('addUrlForm').addEventListener('submit',function (event) {
	event.preventDefault();
	let url = document.getElementById('addUrlInput').value;
	if(addWebsite(url)) {
		addMessage.textContent = `${url} have been added.`
	} else {
		addMessage.textContent = `The url can't be added.`
	}
})


let user = localStorage.getItem("user")
const authentificationForm = document.getElementById('authentificationForm')
const urlForm = document.getElementById('addUrlForm')
const removeForm = document.getElementById('removeUrlForm')
if (user === null) {
	authentificationForm.className = `visible`
	urlForm.className = `hidden`
	removeForm.className = `hidden`

} else {
	authentificationForm.className = `hidden`
	urlForm.className = `visible`
	removeForm.className = `visible`
}
