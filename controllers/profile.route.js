const express = require('express');
const verifyToken = require('../middlewares/auth.mdw');
const router = express.Router();
const User = require('../models/users.models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const Profile = require('../models/profiles.models');

const {
  GOOGLE_CLIENT_ID,
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_LIFETIME,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_LIFETIME,
} = process.env;

router.get('/', verifyToken, async function (req, res) {
  const profile = (await Profile.findOne({ userId: req.userId })).toJSON();
  profile.name = (await User.findOne({ _id: req.userId })).name;
  console.log(profile);
  res.json(profile);
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
