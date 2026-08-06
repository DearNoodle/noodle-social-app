const query = require('../models/query');

async function getUserInfo(req, res) {
  const user = await query.getUserInfo(req);
  res.send(user);
}

async function getSearchPosts(req, res) {
  const posts = await query.getSearchPosts(req);
  res.send(posts);
}

async function updateFollow(req, res) {
  if (req.user.id !== req.params.id) {
    await query.updateFollow(req);
  }
  res.end();
}

async function updateLike(req, res) {
  await query.updateLike(req);
  res.end();
}

module.exports = {
  getUserInfo,
  getSearchPosts,
  updateFollow,
  updateLike,
};
