const express = require("express");
const routes = express();

routes.get("/users");
routes.put("/users");
routes.patch("/users");
routes.delete("/users");

module.exports = routes;
