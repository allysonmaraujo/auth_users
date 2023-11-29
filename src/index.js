const app = require("./server/server");
const pathEnv = require("../pathEnv");
require("dotenv").config(pathEnv);

const port = process.env.SERVER_PORT || 3000;

app.listen(port, () => {
	console.log(`Servidor subiu na porta: ${port}`);
});
