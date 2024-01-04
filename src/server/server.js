const express = require("express");
const app = express();
const cors = require("cors");
const routes = require("../routes/routes");

const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('../doc/swagger-output.json');


app.use(express.json());
app.use(cors());
app.use(routes);
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

module.exports = app;
