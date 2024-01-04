const mongodb = require("mongodb");
const bcrypt = require("bcrypt");
const {
	registerUserSchema,
	updateUserSchema,
	deleteUserSchema,
	patchUserSchema,
} = require("../schema/usersSchema");
const uri = require("../connection/connection");


const dataBaseName = "users";
const collectionName = "active";


const registerUser = async (request, response) => {

	const { name, email, age, cpf, password } = request.body;

	try {
		await registerUserSchema.validate(request.body)
		const created = new Date();
		
		const objectUser = {
			log : 	{
					created,
					},
				active: true,
				name,
				email,
				age,
				cpf,
				}

		const encryptPass = await bcrypt.hash(password, 10, (err, hash) => {
			if (err) throw err;
			objectUser.password = hash;
		});

		let newUser = [];
		newUser.push(objectUser);

		const client = new mongodb.MongoClient(uri);
		
		await client.connect();

		const insertUserResult = await client
			.db(dataBaseName)
			.collection(collectionName)
			.insertOne(objectUser);
		
		await client.close();
		
		if (!insertUserResult.acknowledged) {
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
		
		const findUserResult = await client
			.db(dataBaseName)
			.collection(collectionName)
			.findOne(findQuery);
		
		await client.close();

		if (findUserResult === null) {
			return response.status(404).json({ mensagem: "Nothing found" });
		}
		let id = findUserResult._id.toHexString();
		const { password, _id, ...find } = findUserResult;
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
		
		const findDuplicatedEmail = await client
			.db(dataBaseName)
			.collection(collectionName)
			.findOne({ email : emailNovo })

		if (findDuplicatedEmail){
			return response.status(403).json({message: "email already register to another user"})
		}
		const findDuplicatedCpf = await client
			.db(dataBaseName)
			.collection(collectionName)
			.findOne({ cpf })

		if (findDuplicatedCpf.cpf === cpf && findDuplicatedCpf.email !== emailAntigo){
			return response.status(403).json({message: "cpf already register to another user"})
		}

		const updateUserResult = await client
			.db(dataBaseName)
			.collection(collectionName)
			.findOneAndReplace(query, objectUpdate);
		
		await client.close();

		if (updateUserResult === null) {
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

const patchUser = async (request, response) => {
	const { name, email, age, cpf, password } = request.body;
	
	try {
		await patchUserSchema.validate(request.body)
		
		const client = new mongodb.MongoClient(uri);
		await client.connect();
		
		let query = { email };
		const findEmailResult = await client
			.db(dataBaseName)
			.collection(collectionName)
			.findOne(query)
		
		if (!findEmailResult){
			return response.status(404).json("User's email not found")
		}
		
		const queryCPF = { cpf: Number(cpf) };
		const duplicatedCpfResult = await client
			.db(dataBaseName)
			.collection(collectionName)
			.findOne(queryCPF);
			
	
		if (duplicatedCpfResult !== null && duplicatedCpfResult.email !== email) {
			return response.status(403).json({
				message: "cpf already registered to another user"
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
			const encryptPass = await bcrypt.hash(toString(password), 10, (err, hash) => {
				if (err) throw err;
				objectPatch.password = hash;
			});
		}
		
		const patch = { $set: objectPatch };

		const patchUserResult = await client
			.db(dataBaseName)
			.collection(collectionName)
			.updateOne(query, patch);
		
		await client.close();
		return response		
			.status(202)
			.json({ message: "User's register sucessfully updated" });
	} catch (err) {
		console.log(err);
		return response.status(500).json({ message: `${err.message}` });
	}
};

const deleteUser = async (request, response) => {
	const { email, password } = request.body;

	try {
		await deleteUserSchema.validate(request.body);

		const client = new mongodb.MongoClient(uri);
		await client.connect();
		
		const query = { email };
		
		const findUserResult = await client
			.db(dataBaseName)
			.collection(collectionName)
			.findOne(query);
		if (findUserResult === null) {
			return response
			.status(404)
				.json({ message: "email not found to delete user's document" });
		}

		const validatePass = await bcrypt.compare(
			password,
			findUserResult.password
		);
			
		if (!validatePass) {
			return response
			.status(403)
			.json({ message: "wrong User or Password" });
		}
		
		const deleteUserResult = await client
			.db(dataBaseName)
			.collection(collectionName)
			.findOneAndDelete(query);
			
		await client.close();

		if (!deleteUserResult) {
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

module.exports = {
	registerUser,
	findUser,
	updateUser,
	patchUser,
	deleteUser,
};
