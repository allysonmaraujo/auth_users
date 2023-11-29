const mongoose = require("mongoose");
const pathEnv = require("../../pathEnv");
require("dotenv").config(pathEnv);

const user = process.env.USER_DB;
const pass = process.env.PASS_DB;

const connect = () => {
	mongoose.connect(
		`mongodb+srv://${user}:${pass}@userstable.mfnpu73.mongodb.net/?retryWrites=true&w=majority`
	);

	const connection = mongoose.connection;

	connection.on("error", () => {
		console.error("Não foi possivel conectar ao MongoDB");
	});

	connection.on("open", () => {
		console.log("Conectado do MongoDB com sucesso");
	});
};

connect();

module.exports = mongoose;
