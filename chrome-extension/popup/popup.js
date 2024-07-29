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
	const response = await fetch(`${apiServer}/question/${username}`, options);
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

document.getElementById('removeUrlForm').addEventListener('submit',async function (event) {
	event.preventDefault();
	let url = document.getElementById('removeUrlInput').value;
	const userRecord = await chrome.storage.local.get(["user"])
	const username = userRecord.user.name
	if(await removeWebsite(username, url)) {
		removeMessage.textContent = `${url} have been remove.`
	} else {
		removeMessage.textContent = `The url can't be remove.`
	}
	const updatedUser = await getUser(userRecord.user.name)
	await chrome.storage.local.set({"user": updatedUser})
})

const removeMessage = document.getElementById('removeMessage')
const addMessage = document.getElementById('addMessage')
document.getElementById('addUrlForm').addEventListener('submit',async function (event) {
	event.preventDefault();
	const userRecord = await chrome.storage.local.get(["user"])
	const username = userRecord.user.name
	let url = document.getElementById('addUrlInput').value;
	if(await addWebsite(username, url)) {
		addMessage.textContent = `${url} have been added.`
	} else {
		addMessage.textContent = `The url can't be added.`
	}
	const updatedUser = await getUser(userRecord.user.name)
	await chrome.storage.local.set({"user": updatedUser})
})

const authentificationForm = document.getElementById('authentificationForm')
document.getElementById('authentificationForm').addEventListener('submit',async function (event) {
	event.preventDefault();
	let username = document.getElementById('username').value;
	await registerUser(username)
})

const logoutForm = document.getElementById('logoutForm')
document.getElementById('logoutForm').addEventListener('submit', async function (event) {
	event.preventDefault();
	await chrome.storage.local.set({"user": null})
})

const addQuestionForm = document.getElementById('addQuestionForm')
document.getElementById('addQuestionForm').addEventListener('submit', async function (event) {
	event.preventDefault();
	const statement = document.getElementById('statement').value
	const option1 = document.getElementById('option1').value
	const option2 = document.getElementById('option2').value
	const option3 = document.getElementById('option3').value
	const answerIndex = document.getElementById('answer').value
	const options = [option1, option2, option3]
	const answer = options[answerIndex]
	const question = {statement, options: options, answer}
	const username = (await chrome.storage.local.get(["user"]))?.user.name
	await addQuestion(username, question)
})

async function updateInterface(newUser = null) {
	let user = newUser ? {"user": newUser} : await chrome.storage.local.get(["user"])
	const urlForm = document.getElementById('addUrlForm')
	const removeForm = document.getElementById('removeUrlForm')
	if (!user?.user) {
		authentificationForm.className = `visible`
		urlForm.className = `hidden`
		removeForm.className = `hidden`
		logoutForm.className = `hidden`
		addQuestionForm.className = `hidden`
	} else {
		authentificationForm.className = `hidden`
		urlForm.className = `visible`
		removeForm.className = `visible`
		logoutForm.className = `visible`
		addQuestionForm.className = `visible`
	}
}

chrome.storage.onChanged.addListener(async (changes, namespace) => {
	for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
		if (key = "user") {
			await updateInterface(newValue)
		}
	}
})

updateInterface()

