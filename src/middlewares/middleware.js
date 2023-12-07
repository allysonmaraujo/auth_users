const mongodb = require("mongodb");
const uri = require("../connection/connection");
const { registerUserSchema } = require("../schema/usersSchema");

const verifyDuplicatedUser = async (request, response, next) => {
	const { email, cpf } = request.body;

	try {
		await registerUserSchema.validate(request.body);

		const client = new mongodb.MongoClient(uri);
		await client.connect();

		const queryCPF = { cpf: Number(cpf) };
		const searchCpf = await client
			.db("UsersTable")
			.collection("list")
			.findOne(queryCPF);
		const searchEmail = await client
			.db("UsersTable")
			.collection("list")
			.findOne({ email });

		await client.close();
		if (searchCpf !== null || searchEmail !== null) {
			return response
				.status(403)
				.json({ message: "User already registered" });
		}
	} catch (err) {
		return response.status(500).json(`${err.message}`);
	}
	next();
};

module.exports = verifyDuplicatedUser;
