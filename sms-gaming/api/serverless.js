const app = require('../lib/app');
const serverless = require('serverless-http');

// Export the wrapped handler
module.exports = serverless(app); 