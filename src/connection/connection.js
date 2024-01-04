require("dotenv").config();

const user = process.env.USER_DB;
const pass = process.env.PASS_DB;
uri = `mongodb+srv://${user}:${pass}@userstable.mfnpu73.mongodb.net/?retryWrites=true&w=majority`;

module.exports = uri;
