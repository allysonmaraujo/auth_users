const mongodb = require("mongodb");
const uri = require("../connection/connection");
const bcrypt = require("bcrypt");
const {
	registerUserSchema,
	updateUserSchema,
	deleteUserSchema,
} = require("../schema/usersSchema");

const registerUser = async (request, response) => {
	const { name, email, age, cpf, password } = request.body;

	try {
		const objectUser = {
			name,
			email,
			age,
			cpf,
		};

		const encryptPass = await bcrypt.hash(password, 10, (err, hash) => {
			if (err) throw err;
			objectUser.password = hash;
		});

		let newUser = [];
		newUser.push(objectUser);

		const client = new mongodb.MongoClient(uri);
		await client.connect();

		const insertResult = await client
			.db("UsersTable")
			.collection("list")
			.insertOne(objectUser);
		if (!insertResult.acknowledged) {
			return response.status(500).json({
				mensagem: "Something wrong to insert a new user",
			});
		}
		await client.close();
		return response.status(201).json();
	} catch (err) {
		return response.status(500).json({
			mensagem: `${err.message}`,
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

	try {
		const client = new mongodb.MongoClient(uri);
		await client.connect();

		let findQuery = {};

		if (cpf) {
			findQuery = { cpf: Number(cpf) };
		} else {
			findQuery = { email };
		}
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

		await client.close();
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
	const { name, emailAntigo, emailNovo, age, cpf, password } = request.body;

	try {
		await updateUserSchema.validate(request.body);

		const client = new mongodb.MongoClient(uri);
		await client.connect();

		const encryptPass = await bcrypt.hash(password, 10);

		const objectUpdate = {
			name,
			email: emailNovo,
			age,
			cpf,
			password: encryptPass,
		};
		const query = { email: emailAntigo };
		const updateResult = await client
			.db("UsersTable")
			.collection("list")
			.findOneAndReplace(query, objectUpdate);

		if (updateResult === null) {
			return response
				.status(404)
				.json({ message: "email not found to update user's document" });
		}

		await client.close();
		return response.status(200).json({ message: "Update complete" });
	} catch (err) {
		console.log(err);
		return response.status(500).json({ message: err.message });
	}
};

const deleteUser = async (request, response) => {
	const { email, password } = request.body;

	try {
		await deleteUserSchema.validate(request.body);

		const client = new mongodb.MongoClient(uri);
		await client.connect();

		const query = { email };

		const findResult = await client
			.db("UsersTable")
			.collection("list")
			.findOne(query);
		if (findResult === null) {
			return response
				.status(404)
				.json({ message: "email not found to delete user's document" });
		}

		const validatePass = await bcrypt.compare(
			password,
			findResult.password
		);

		if (!validatePass) {
			return response
				.status(403)
				.json({ message: "wrong User or Password" });
		}
		const deleteResult = await client
			.db("UsersTable")
			.collection("list")
			.findOneAndDelete(query);
		if (!deleteResult.acknowledged) {
			return response
				.status(400)
				.json({ message: "User's document was not deleted" });
		}

		await client.close();
		return response
			.status(200)
			.json({ message: "User's document was sucessfuly deleted" });
	} catch (err) {
		return response.status(500).json({ message: `${err.message}` });
	}
};

const patchUser = async (request, response) => {
	const { name, email, age, cpf, password } = request.body;

	try {
		const client = new mongodb.MongoClient(uri);
		await client.connect();

		let query = { email };
		let objectPatch = {};
		if (name) {
			objectPatch.name = name;
		}
		if (age) {
			objectPatch.age = Number(age);
		}
		if (cpf) {
			const query = { cpf: Number(cpf) };
			const findDuplicatedCpf = await client
				.db("UsersTable")
				.collection("list")
				.findOne(query);
			if (findDuplicatedCpf !== null) {
				return response.status(403).json({
					message:
						"cpf already registered on our database to another user",
				});
			}
		}
		objectPatch.cpf = Number(cpf);
		if (password) {
			const encryptPass = await bcrypt.hash(password, 10, (err, hash) => {
				if (err) throw err;
				objectPatch.password = hash;
			});
		}
		const patch = { $set: objectPatch };

		const patchResult = await client
			.db("UsersTable")
			.collection("list")
			.updateOne(query, patch);

		console.log(patchResult);
		await client.close();
		return response
			.status(200)
			.json({ message: "User's register sucessfully updated" });
	} catch (err) {
		console.error(err);
		return response.status(500).json({ message: `${err.message}` });
	}
};

module.exports = {
	registerUser,
	findUser,
	updateUser,
	patchUser,
	deleteUser,
};
