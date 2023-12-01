const express = require("express");
const routes = express();

const {
	registerUser,
	findUser,
	deleteUser,
	updateUser,
} = require("../controllers/users");

routes.post("/users", registerUser);
routes.post("/login");
routes.get("/users", findUser);
routes.patch("/users", updateUser);
routes.delete("/users", deleteUser);

module.exports = routes;
