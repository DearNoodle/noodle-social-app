const query = require('../models/query');

async function getSearchPosts(req, res) {
  const posts = await query.getSearchPosts(req);
  res.send(posts);
}

async function getSearchUsers(req, res) {
  const users = await query.getSearchUsers(req);
  res.send(users);
}

module.exports = {
  getSearchPosts,
  getSearchUsers,
};
