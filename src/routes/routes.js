const express = require("express");
const routes = express();

const {
	registerUser,
	findUser,
	deleteUser,
	updateUser,
	patchUser,
} = require("../controllers/users");
const userLogin = require("../controllers/login");
const verifyDuplicatedUser = require("../middlewares/middleware");

routes.post("/users", verifyDuplicatedUser, registerUser);
routes.get("/login", userLogin);

// routes.use();

routes.get("/users", findUser);
routes.put("/users", updateUser);
routes.patch("/users", patchUser);
routes.delete("/users", deleteUser);

module.exports = routes;
