const query = require('../models/query');

async function getHomePageData(req, res) {
  const posts = await query.getRecentPosts(req);
  res.send(posts);
}

async function getProfilePageData(req, res) {
  const profile = await query.getUserProfile(req);
  res.send(profile);
}

async function getUserPageData(req, res) {
  const userInfo = await query.getUserInfo(req);
  const posts = await query.getUserPosts(req);
  const followStatus = await query.getFollowStatus(req);
  res.json({ userInfo, posts, followStatus });
}

async function getPostPageData(req, res) {
  const postInfo = await query.getPostInfo(req);
  const likeStatus = await query.getLikeStatus(req);
  res.json({ postInfo, likeStatus });
}

async function getFollowsPageData(req, res) {
  const follows = await query.getFollowedUsers(req);
  res.send(follows);
}

module.exports = {
  getHomePageData,
  getProfilePageData,
  getUserPageData,
  getPostPageData,
  getFollowsPageData,
};
