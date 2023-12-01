const pathEnv = require("../../pathEnv");
require("dotenv").config(pathEnv);
//problema no dotenv , tive que configurar o caminho do arquivo

const user = process.env.USER_DB;
const pass = process.env.PASS_DB;
uri = `mongodb+srv://${user}:${pass}@userstable.mfnpu73.mongodb.net/?retryWrites=true&w=majority`;

module.exports = uri;
