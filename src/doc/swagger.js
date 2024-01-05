const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'auth_users',
    description: 'API CRUD para de cadastro de usuários'
  },
  host: 'localhost:3000'
};

const outputFile = './swagger-output.json';
const routes = ['./routes/routes'];

swaggerAutogen(outputFile, routes, doc);