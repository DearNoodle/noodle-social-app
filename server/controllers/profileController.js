const query = require('../models/query');

async function getUserProfile(req, res) {
  const profile = await query.getUserProfile(req);
  res.send(profile);
}

async function updateProfileImage(req, res) {
  await query.updateProfileImage(req);
  res.send();
}
async function updateProfileBio(req, res) {
  await query.updateProfileBio(req);
  res.send();
}

module.exports = {
  getUserProfile,
  updateProfileImage,
  updateProfileBio,
};
