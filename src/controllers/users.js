const mongodb = require("mongodb");
const uri = require("../connection/connection");
const bcrypt = require("bcrypt");

const registerUser = async (request, response) => {
	const { name, email, age, cpf, password } = request.body;

	if (!name || !email || !age || !cpf || !password) {
		return response
			.status(400)
			.json({ mensagem: "Todo os campos são obrigatórios" });
	}

	const encryptedPass = await bcrypt.hash(password, 10);

	const objectUser = {
		name,
		email,
		age,
		cpf,
		password: encryptedPass,
	};
	let newUser = [];
	newUser.push(objectUser);

	const client = new mongodb.MongoClient(uri);
	await client.connect();

	try {
		const insertResult = await client
			.db("UsersTable")
			.collection("list")
			.insertOne(objectUser);
		if (insertResult.acknowledged) {
			return response.status(201).json({
				mensagem: "Document successfully inserted",
			});
		}
	} catch (err) {
		return response.status(500).json({
			mensagem: `Something went wrong trying to insert the new documents: ${err}\n`,
		});
	}
};

const findUser = async (request, response) => {
	const { email, cpf } = request.body;

	if (!email && !cpf) {
		return response
			.status(400)
			.json({ mensagem: "cpf or email necessary" });
	}

	const client = new mongodb.MongoClient(uri);
	await client.connect();

	let findQuery = {};

	if (cpf) {
		findQuery = { cpf: Number(cpf) };
	} else {
		findQuery = { email };
	}

	try {
		const findResult = await client
			.db("UsersTable")
			.collection("list")
			.findOne(findQuery);

		if (findResult === null) {
			return response.status(404).json({ mensagem: "Nothing found" });
		}
		let id = findResult._id.toHexString();
		const { password, _id, ...find } = findResult;
		find.id = id;
		return response.status(202).json(find);
	} catch (err) {
		console.error(err);
		return response
			.status(500)
			.json(
				`Something went wrong trying to insert the new documents: ${err}`
			);
	}
};

const updateUser = async (request, response) => {
	const { name, email, age, cpf, password } = request.body;

	if (!name && !email && !age && !cpf && !password) {
		return response
			.status(400)
			.json({ message: "We need one or more fields to update user" });
	}
};

const deleteUser = async (request, response) => {
	const { email } = request.body;

	if (!email) {
		response
			.status(403)
			.json({ message: "email necessary to delete account" });
	}
};

module.exports = {
	registerUser,
	findUser,
	updateUser,
	deleteUser,
};
