const express = require('express');
const verifyToken = require('../middlewares/auth.mdw');
const router = express.Router();
const User = require('../models/users.models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const Profile = require('../models/profiles.models');

router.get('/', verifyToken, async function (req, res) {
  var profile = await Profile.findOne({ userId: req.userId });
  if (profile == null) {
    const newProfile = new Profile({ userId: req.userId });
    profile = await newProfile.save();
  }
  const profileUser = profile.toJSON();
  const user = await User.findOne({ _id: req.userId });
  profileUser.name = user.name;
  profileUser.email = user.email;
  res.json(profileUser);
});
router.post('/', verifyToken, async function (req, res) {
  const { name, gender, studentId, place, about } = req.body;
  await User.updateOne({ _id: req.userId }, { $set: { name: name } });
  await Profile.updateOne(
    { userId: req.userId },
    { $set: { gender, studentId, place, about } }
  );
  const profile = await Profile.find({ userId: req.userId });
  res.json(profile);
});

module.exports = router;
