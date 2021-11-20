const express = require('express');
const verifyToken = require('../middlewares/auth.mdw');
const router = express.Router();
const User = require('../models/users.models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const {
  GOOGLE_CLIENT_ID,
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_LIFETIME,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_LIFETIME,
} = process.env;

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

const tokenList = {};

router.get('/', verifyToken, async function (req, res) {
  const user = await User.findOne({ _id: req.userId });
  res.json({ success: true, user });
});

router.post('/login', async function (req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: 'Missing email or password' });
  }
  try {
    const user = await User.findOne({ email });
    console.log(await User.findOne());
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: 'Incorrect email' });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return res
        .status(400)
        .json({ success: false, message: 'Incorrect password' });
    }
    const accessToken = jwt.sign({ userId: user._id }, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_LIFETIME,
    });
    const refreshToken = jwt.sign({ userId: user._id }, REFRESH_TOKEN_SECRET, {
      expiresIn: REFRESH_TOKEN_LIFETIME,
    });
    tokenList[refreshToken] = user._id;
    return res.json({
      success: true,
      message: 'User logged in successfully',
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
});
router.post('/googlelogin', function (req, res) {
  const { tokenId } = req.body;
  client
    .verifyIdToken({ idToken: tokenId, audience: GOOGLE_CLIENT_ID })
    .then(async (response) => {
      const { email_verified, name, email } = response.payload;
      console.log(email_verified, name, email);
      if (email_verified) {
        try {
          const user = await User.findOne({ email: email });
          if (!user) {
            return res
              .status(400)
              .json({ success: false, message: 'Email is not registered' });
          }
          const accessToken = jwt.sign(
            { userId: user._id },
            ACCESS_TOKEN_SECRET,
            {
              expiresIn: ACCESS_TOKEN_LIFETIME,
            }
          );
          const refreshToken = jwt.sign(
            { userId: user._id },
            REFRESH_TOKEN_SECRET,
            {
              expiresIn: REFRESH_TOKEN_LIFETIME,
            }
          );
          tokenList[refreshToken] = user._id;
          return res.json({
            success: true,
            message: 'User logged in successfully',
            accessToken,
            refreshToken,
          });
        } catch (error) {
          console.log(error);
          return res
            .status(500)
            .json({ success: false, message: 'Internal server error' });
        }
      }
    });
});
router.post('/register', async function (req, res) {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res
      .status(400)
      .json({ success: false, message: 'Missing email, password or name' });
  }
  try {
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: 'Email already exists' });
    }
    const hashPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({
      email,
      password: hashPassword,
      name,
    });
    await newUser.save();

    const accessToken = jwt.sign({ userId: newUser._id }, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_LIFETIME,
    });
    const refreshToken = jwt.sign(
      { userId: newUser._id },
      REFRESH_TOKEN_SECRET,
      {
        expiresIn: REFRESH_TOKEN_LIFETIME,
      }
    );
    tokenList[refreshToken] = newUser._id;
    return res.json({
      success: true,
      message: 'User created successfully',
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
});

router.post('/refresh_token', function (req, res) {
  const { refreshToken } = req.body;
  if (refreshToken && refreshToken in tokenList) {
    try {
      console.log(refreshToken);
      jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
      const userId = tokenList[refreshToken];
      const accessToken = jwt.sign({ userId }, ACCESS_TOKEN_SECRET, {
        expiresIn: ACCESS_TOKEN_LIFETIME,
      });
      return res.json({
        success: true,
        message: 'Access token refresh',
        accessToken,
      });
    } catch (err) {
      console.error(err);
      res.status(403).json({
        message: 'Invalid refresh token',
      });
    }
  } else {
    res.status(400).json({
      message: 'Invalid request',
    });
  }
});

module.exports = router;
