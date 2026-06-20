// Vercel serverless entry — loads the compiled NestJS handler from dist/
const mod = require('../dist/lambda.js');
module.exports = mod.default ?? mod;
