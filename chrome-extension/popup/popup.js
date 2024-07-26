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

/*
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



const addMessage = document.getElementById('addMessage')
const removeMessage = document.getElementById('removeMessage')
document.getElementById('addForm').addEventListener('submit',function (event) {
	event.preventDefault();
	let url = document.getElementById('addUrl').value;
	if(addWebsite(url)) {
		addMessage.textContent = `${url} have been added.`
	} else {
		addMessage.textContent = `The url can't be added.`
	}
})

document.getElementById('removeForm').addEventListener('submit',function (event) {
	event.preventDefault();
	let url = document.getElementById('removeUrl').value;
	if(removeWebsite(url)) {
		removeMessage.textContent = `${url} have been remove.`
	} else {
		removeMessage.textContent = `The url can't be remove.`
	}
})
*/

let user = localStorage.getItem("user")
const authentificationForm = document.getElementById('authentificationForm')
if (user === null) {
	authentificationForm.className = `visible`
}
