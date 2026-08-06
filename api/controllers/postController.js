const query = require('../models/query');

async function createPost(req, res) {
  await query.createPost(req);
  res.end();
}

async function deletePost(req, res) {
  await query.deletePost(req);
  res.end();
}

module.exports = {
  createPost,
  deletePost,
};
