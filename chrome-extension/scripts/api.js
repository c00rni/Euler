const apiServer = "http://localhost:3000"

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
	}
	catch(err) {
		throw new Error(`the input: ${rawUrl} failed to normalize: ${err.message}`)
	}
	
	return url.hostname
}

async function getUser(username) {
	const response = await fetch(`${apiServer}/user/${username}`, {
		headers: {
			"Content-Type": "application/json",
		},
	});
	
	if (response.status < 201) {
		const user = await response.json()
		if (JSON.stringify(user) !== JSON.stringify({}) ) {
			return user 
		}
	}
	return null
}

async function createUser(username) {
	const response = await fetch(`${apiServer}/user/create/${username}`, {
		headers: {
			"Content-Type": "application/json",
		},
		method: "POST",
		body: JSON.stringify({})
	});
	
	if (response.status < 201) {
		const user = await response.json()
		if (user["success"]) {
			return user["success"] 
		} 
	}
	return null
}

async function addQuestion(username, question) {
	const options = {
		headers: new Headers({
			'content-type': 'application/json',
			'Accept': 'application/json'
		}),
		method: "POST",
		body: JSON.stringify(question),
		mode: "cors"
	}
	const response = await fetch(`${apiServer}/question/create/${username}`, options);
	if (response.status < 201) {
		const user = await response.json()
		if (user["success"]) {
			return user["success"] 
		} 
	}
	return null
}

async function registerUser(username) {
	let response = null;
	try {
		const user = await getUser(username)
		if (user) {
			await chrome.storage.local.set({"user": user})
		} else {
			const newUser = await createUser(username)
			if (newUser) {
				await chrome.storage.local.set({"user": newUser})
			}
		}
	} catch(err) {
		console.log(err.message)
	}
}

async function addWebsite(username, url) {
	try {
		const domain = normalizeUrl(url)
		const response = await fetch(`${apiServer}/restrict/${username}/${domain}`, {
			headers: {"Content-Type": "application/json"},
			method: "PUT",
		})
	} catch(error) {
		console.log(error.message)
		return false
	}
	return true
}


async function removeWebsite(username, url) {
	try {
		const domain = normalizeUrl(url)
		const response = await fetch(`${apiServer}/unrestrict/${username}/${domain}`, {
			headers: {"Content-Type": "application/json"},
			method: "PUT",
		})
	} catch(error) {
		console.log(error.message)
		return false
	}
	return true
}

async function getQuestions(username) {
	try {
		const response = await fetch(`${apiServer}/questions/${username}`,{
				headers: {"Content-Type": "application/json"},
				method: "GET",
			});
		if (response.status < 201) {
			return await response.json()
		}
	} catch(err) {
		console.log(err.message)
		return null
	}
}

