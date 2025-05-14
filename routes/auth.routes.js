const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const bcryptjs = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const { User, validateRegisterUser, validateLoginUser } = require('../models/user.model');
const { generateverificationToken } = require('../utlis/generateverificationToken');
const { generateToken } = require('../utlis/generateToken');

// User Signup
router.post('/signup', asyncHandler(async (req, res) => {
  const { error } = validateRegisterUser(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { email, password, username } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: "User already exists" });

  const usernameExists = await User.findOne({ username });
  if (usernameExists) return res.status(400).json({ message: "Username taken" });

  const user = new User({
    userId: uuidv4(), 
    email,
    username,
    password: await bcryptjs.hash(password, 10),
    verificationToken: generateverificationToken(),
    verificationTokenExpiresAt: Date.now() + 86400000,
    isVerified: true
  });

  await user.save();
  generateToken(res, user.userId); 

  res.status(201).json({
    success: true,
    user: {
      userId: user.userId,
      email: user.email,
      username: user.username,
      createdAt: user.createdAt,
    },
  });
}));

// User Login
router.post('/login', asyncHandler(async (req, res) => {
  const { error } = validateLoginUser(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const user = await User.findOne({ email: req.body.email });
  if (!user || !(await bcryptjs.compare(req.body.password, user.password))) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = generateToken(res, user.userId); 

  res.json({
    success: true,
    token,
    user: {
      userId: user.userId,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
    },
  });
}));

module.exports = router;
