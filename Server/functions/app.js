const serverless = require('serverless-http');
const app = require('/Server/server'); // Import the Express app from server.js

module.exports.handler = serverless(app);
