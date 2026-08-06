const query = require('../models/query');

async function createComment(req, res) {
  await query.createComment(req);
  res.end();
}

async function deleteComment(req, res) {
  await query.deleteComment(req);
  res.end();
}

module.exports = {
  createComment,
  deleteComment,
};
