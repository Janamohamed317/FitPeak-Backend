const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const bcryptjs = require('bcryptjs');
const { User, validateRegisterUser, validateLoginUser } = require('../models/user.model');
const { generateverificationToken } = require('../utlis/generateverificationToken');
const { generateToken } = require('../utlis/generateToken');

router.post('/signup', asyncHandler(async (req, res) => {
  const { error } = validateRegisterUser(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { email, password, username } = req.body;

  const [userExists, usernameExists] = await Promise.all([
    User.findOne({ email }),
    User.findOne({ username })
  ]);

  if (userExists) return res.status(400).json({ message: "User already exists" });
  if (usernameExists) return res.status(400).json({ message: "Username taken" });

  const user = new User({
    email,
    username,
    password: await bcryptjs.hash(password, 10),
    verificationToken: generateverificationToken(),
    verificationTokenExpiresAt: Date.now() + 86400000,
    isVerified: true
  });

  await user.save();
  generateToken(res, user._id);

  res.status(201).json({
    success: true,
    user: { ...user._doc, password: undefined }
  });
}));


// Login User
router.post('/login', asyncHandler(async (req, res) => {
  const { error } = validateLoginUser(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const user = await User.findOne({ email: req.body.email });
  if (!user || !(await bcryptjs.compare(req.body.password, user.password))) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = generateToken(res, user._id);

  res.json({
    success: true,
    token,
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
    },
  });
}));

// Logout User
router.post('/logout', (req, res) => {
  res.clearCookie('token').json({ success: true });
});

// Check Authentication
router.get('/check-auth', (req, res) => {
  res.json({ success: true, user: req.user || null });
});

module.exports = router;