const app = require("./server/server");
require("dotenv").config();

const port = process.env.SERVER_PORT || 3000;


app.listen(port, () => {
	console.log(`Servidor subiu na porta: ${port}`);
});
