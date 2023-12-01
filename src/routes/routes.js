const express = require("express");
const routes = express();

const {
	registerUser,
	findUser,
	deleteUser,
	updateUser,
} = require("../controllers/users");
const userLogin = require("../controllers/login");

routes.post("/users", registerUser);
routes.get("/login", userLogin);

// routes.use();

routes.get("/users", findUser);
routes.patch("/users", updateUser);
routes.delete("/users", deleteUser);

module.exports = routes;
