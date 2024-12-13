const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Signup API
router.post('/signup', async (req, res) => {
  const { username, email, password, role, phone } = req.body;
  try {
    // Input validation
    if (!username || !email || !password || !role || !phone) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check if the username or email already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username is already in use.' });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email is already in use.' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user instance
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
      phone,
    });

    // Save the new user to the database
    await newUser.save();
    res.status(201).json({ message: 'Signup successful. Please log in.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during signup.' });
  }
});

// Login API
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    // Input validation
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }

    // Check if the user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    // Check if the password matches
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { username: user.username, role: user.role, id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Send the token and user data in the response
    res.status(200).json({
      message: 'Login successful.',
      token,
      user: {
        username: user.username,
        role: user.role,
        email: user.email,
        phone: user.phone,
        id: user._id,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

module.exports = router;
