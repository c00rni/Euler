const express = require('express')
const { MongoClient } = require("mongodb");
const { ObjectId } = require("mongodb")
const path = require('path');
const app = express()
const cors = require('cors')
const PORT = 3000
require('dotenv').config()


const maximumNumberOfResults = parseInt(process.env.MAX_QUIZZ_QUESTIONS)
const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URI}.mongodb.net/?retryWrites=true&w=majority`
let client;


try {
	client = new MongoClient(uri);
} catch(err) {
	console.log(err.message)
	return 1
}

async function createUser(name) {
	try {
		if (!await findOneByName(name)) {
			const result = await client.db("restricter").collection("users").insertOne({"username": name, "restricted_domains": {}, "restriction_date": 0})
			console.log(`New user created with the following name: ${name} and id: ${result.insertedId}`)
		}
		else {
			throw new Error("User already exist.")
		}
	} catch(err) {
		console.log(err.message)
	}
}

async function findOneByName(name) {
	try {
		return await client.db("restricter").collection("users").findOne({"username": {$eq: name}});
	} catch(err) {
		console.log(err.message)
	}
}


async function createQuestion(username, question) {
	try {
		const timeSpace = 1000*60*60*12
		const reharshTimestamp = Date.now() //+ (1000*60*60*12)
		const fullQuestion = {username: username, reharshTimestamp, timeSpace, ...question}
		console.log(`Question created by ${username}`)
		return await client.db("restricter").collection("questions").insertOne(fullQuestion)
	} catch(err) {
		console.log(err.message)
		return null
	}
}

async function deleteQuestion(id) {
	try {
		const result = await client.db("restricter").collection("questions").deleteOne({_id: id});
		console.log(`${result.deletedCount} question was/were deleted.`);
		return 1;
	} catch (err) {
		console.log(err.message)
		return 0
	}
}

async function restrictDomain(username, domain) {
	try {
		const user = await findOneByName(username)
		if (user) {
			const restricted_domains = user.restricted_domains || {}
			
			if (restricted_domains[domain]) {
				return 0
			}
			restricted_domains[domain] = true
			const filter = {username: username}
			user.restricted_domains = restricted_domains
			await client.db("restricter").collection("users").updateOne(filter, {$set: user})
			console.log(`Domain ${domain} have been restricted by ${username}`)
			return 1
		}
		return 0
	} catch(err) {
		console.log(err.message)
		throw new Error(err.message)
	}
}

async function findQuestions(username) {
	try {
		const cursor = await client.db("restricter").collection("questions").find(
			{
				"username": {$eq: username},
				"reharshTimestamp": {$lte: Date.now()},
			}
		).sort({"reharshTimestamp" : 1})
		.limit(maximumNumberOfResults);
		return await cursor.toArray();
	} catch(err) {
		console.log(err.message)
	}
}

async function unrestrictDomain(username, domain) {
	try {
		const user = await findOneByName(username)
		const restricted_domains = user?.restricted_domains || {}
		if (user && restricted_domains[domain]) {
			delete restricted_domains[domain]
			const filter = {username: username}
			await client.db("restricter").collection("users").updateOne(filter, {$set: user})
			return 1
		}
		return 0
	} catch(err) {
		console.log(err.message)
		throw new Error(err.message)
	}
}

async function updateTimeQuestion(questionId, space) {
	try {
		const filter = {"_id": new ObjectId(`${questionId}`)}
		const res = await client.db("restricter").collection("questions").updateOne(filter, {$set: {"timeSpace" : space*2, "reharshTimestamp" : Date.now() + space * 2}})
		return res.modifiedCount
	} catch(err) {
		console.log(err.message)
		throw new Error(err.message)
	}
	return 0
}

async function resetTimespace(questionId) {
	try {
		const filter = {"_id": new ObjectId(`${questionId}`)}
		const res = await client.db("restricter").collection("questions").updateOne(filter, {$set: {"timeSpace" : 1000*60*60*12}})
		return res.modifiedCount
	} catch(err) {
		console.log(err.message)
		throw new Error(err.message)
	}
	return 0
}

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

app.get('/:username', (req, res) => {
	const options = {
		root: path.join(__dirname, 'build'),
		dotfiles: 'deny',
	}
	res.sendFile("index.html", options, (err) => {
		if (err) {
			 console.log(err)
		} else {

		}
	})
})

app.get('/user/:name', async (req, res) => {
	const user = await findOneByName(req.params.name)
	if (user) {
		res.json(user)
	} else {
		res.json({})
	}
})

app.post('/user/create/:name', async (req, res) => {
	try {
		await createUser(req.params.name)
		const user = await findOneByName(req.params.name)
		res.json({success: user})
	} catch(err) {
		res.json({error: err.message})
	}
})

app.post('/question/create/:name', async (req, res) => {
	const question = await createQuestion(req.params.name, req.body)
	if (question) {
		res.json({succes: question})
	} else {
		res.json({error: `Interlnal error. Question not registered.`})	
	}
})

app.get('/questions/:username', async (req, res) => {
	const questions = await findQuestions(req.params.username)
	res.json(questions)
})

app.put('/question/:id/:space', async (req, res) => {
	const result = await updateTimeQuestion(req.params.id, req.params.space)
	if (result) {
		res.json({success: `Space repetition time updated`})
	} else {
		res.json({error: `time not updated`})
	}
})

app.put('/reset/:id', async (req, res) => {
	const result = await resetTimespace(req.params.id)
	if (result) {
		res.json({success: `Space repetition time updated`})
	} else {
		res.json({error: `time not updated`})
	}
})

app.get('/unrestrict/:username', async (req, res) => {
	const user = await findOneByName(req.params.username)
	let result;
	if (user) {
		const filter = {"username": req.params.username}
		try {
			let result = await client.db("restricter").collection("users").updateOne(filter, {$set: {"restriction_date" : Date.now() + 1000*60*30}})
		} catch(err) {
			console.log(err.message)
		}
	}
	else {
		console.log(`${req.params.username} can't be restristed`)
	}
	if (result && result.modifiedCount) {
		res.json({success: `User ${req.params.username} unrestricted for 30mins`})
	} else {
		res.json({error: `User not updated.`})
	}

})

app.delete('/question/:id', async (req, res) => {
	const count = await deleteQuestion(req.params.id)
	if (count) {
		res.json({success: `${count} question deleted.`})
	} else {
		res.json({error: `no question deleted.`})
	}
})

app.put('/restrict/:username/:domain', async (req, res) => {
	try {
		const count = await restrictDomain(req.params.username, req.params.domain)
		if (count) {
			res.json({success: `Domain restricted.`})
		} else {
			res.json({error: `Domain can't be restricted.`})
		}
	} catch(err) {
		res.json({error: `The domain couldn't be restricted due to an internal error.`})
	}
})

app.put('/unrestrict/:username/:domain', async (req, res) => {
	try {
		const count = await unrestrictDomain(req.params.username, req.params.domain)
		if (count) {
			res.json({error: `Domain unrestrict.`})
		} else {
			res.json({error: `Domain still can't be unrestricted`})
		}
	} catch(err) {
		res.json({error: `An internal error occured.`})
	}
})

app.listen(PORT, () =>{
	console.log(`Started listening on port ${PORT}`)
})
