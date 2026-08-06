// Single Vercel serverless function entry — the rest of the Express
// app lives in ../server to stay outside Vercel's api/ scan scope.
module.exports = require('../server/app');
