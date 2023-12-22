const mongodb = require("mongodb");
const bcrypt = require("bcrypt");
const {
	registerUserSchema,
	updateUserSchema,
	deleteUserSchema,
} = require("../schema/usersSchema");
const uri = require("../connection/connection");


const dataBaseName = "UsersTable";
const collectionName = "list";


const registerUser = async (request, response) => {

	const { name, email, age, cpf, password } = request.body;

	try {
		await registerUserSchema.validate(request.body)

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
			.db(dataBaseName)
			.collection(collectionName)
			.insertOne(objectUser);
		
		await client.close();
		
		if (!insertResult.acknowledged) {
			return response.status(500).json({
				mensagem: "Something wrong to insert a new user",
			});
		}
		
		return response.status(201).json({message: "register complete"});
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
		let findQuery = {};
		
		if (cpf) {
			findQuery = { cpf: Number(cpf) };
		} else {
			findQuery = { email };
		}
		
		const client = new mongodb.MongoClient(uri);
		await client.connect();
		
		const findResult = await client
			.db(dataBaseName)
			.collection(collectionName)
			.findOne(findQuery);
		
		await client.close();

		if (findResult === null) {
			return response.status(404).json({ mensagem: "Nothing found" });
		}
		let id = findResult._id.toHexString();
		const { password, _id, ...find } = findResult;
		find.id = id;

		return response.status(202).json(find);
	} catch (err) {
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

		
		const encryptPass = await bcrypt.hash(password, 10);
		
		const objectUpdate = {
			name,
			email: emailNovo,
			age,
			cpf,
			password: encryptPass,
		};
		const query = { email: emailAntigo };
		
		const client = new mongodb.MongoClient(uri);
		await client.connect();
		
		const updateResult = await client
			.db(dataBaseName)
			.collection(collectionName)
			.findOneAndReplace(query, objectUpdate);
		
		await client.close();

		if (updateResult === null) {
			return response
				.status(404)
				.json({ message: "email not found to update user's document" });
		}

		return response.status(202).json({ message: "Update complete" });
	} catch (err) {
		console.log(err);
		return response.status(500).json({ message: err.message });
	}
};

const deleteUser = async (request, response) => {
	const { email, password } = request.body;

	try {
		await deleteUserSchema.validate(request.body);

		await client.connect();
		
		const query = { email };
		
		const findResult = await client
			.db(dataBaseName)
			.collection(collectionName)
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
		const client = new mongodb.MongoClient(uri);
		
		const deleteResult = await client
			.db("UsersTable")
			.collection("list")
			.findOneAndDelete(query);
			
		await client.close();

		if (!deleteResult) {
			return response
				.status(400)
				.json({ message: "User's document was not deleted" });
		}

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
		const findEmail = await client
			.db(dataBaseName)
			.collection(collectionName)
			.findOne(query)
		if (!findEmail){
			return response.status(404).json("User not found by email")
		}
		
		const queryCPF = { cpf: Number(cpf) };
		const findDuplicatedCpf = await client
			.db(dataBaseName)
			.collection(collectionName)
			.findOne(queryCPF);
			
		if (findDuplicatedCpf !== null) {
			return response.status(403).json({
				message: "cpf already registered on our database to another user"
			});
		}
		
		let objectPatch = {};
		if (name) {
			objectPatch.name = name;
		}
		if (age) {
			objectPatch.age = Number(age);
		}
		if (cpf) {
			objectPatch.cpf = Number(cpf);
		}
		if (password) {
			const encryptPass = await bcrypt.hash(password, 10, (err, hash) => {
				if (err) throw err;
				objectPatch.password = hash;
			});
		}
		
		const patch = { $set: objectPatch };

		const patchResult = await client
			.db(dataBaseName)
			.collection(collectionName)
			.updateOne(query, patch);
		
		console.log(patchResult);
		
		await client.close();
		return response
			.status(202)
			.json({ message: "User's register sucessfully updated" });
	} catch (err) {
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
