const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongodb = require("mongodb");
const uri = require("../connection/connection");
const path = require("../../pathEnv");
const loginUserSchamea = require("../schema/loginSchema");

require("dotenv").config(path);

const userLogin = async (request, response) => {
	const { email, password } = request.body;

	try {
		await loginUserSchamea.validate(request.body);

		const client = new mongodb.MongoClient(uri);

		await client.connect();

		const findlogin = await client
			.db("UsersTable")
			.collection("list")
			.findOne({ email });

		await client.close();

		if (findlogin === null) {
			return response
				.status(404)
				.json({ message: "incorrect email or password" });
		}

		const passCrypt = findlogin.password;
		const verifyLogin = await bcrypt.compare(password, passCrypt);

		if (!verifyLogin) {
			return response
				.status(404)
				.json({ message: "incorrect email or password" });
		}

		const { password: _pass, _id, ...user } = findlogin;
		let id = findlogin._id.toHexString();
		user.id = id;
		const token = jwt.sign({ id }, process.env.JWT_PASS, {
			expiresIn: "8h",
		});
		const objectLogin = {
			user,
			token,
		};
		return response.status(202).json(objectLogin);
	} catch (err) {
		return response.status(500).json({ message: "Internal error" });
	}
};

module.exports = userLogin;
