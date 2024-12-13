const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Signup API
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password, role, phone } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username is already in use.' });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email is already in use.' });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({
      username,
      email,
      password: hashedPassword, // Use the hashed password
      role,
      phone,
    });

    // Save the user to the database
    await user.save();
    res.status(200).json({ message: 'Signup successful.' });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: 'Server error.' });
  }
});

// Login API
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    // Check if the provided password matches the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    // If the username and password are valid, create a JWT token
    const token = jwt.sign(
      { username: user.username, role: user.role, id: user._id }, // Include user ID in the token for later use
      process.env.JWT_SECRET, // Ensure this is in your .env file
      { expiresIn: '1h' } // Token expiration time (1 hour)
    );

    // Send the token and user data in the response
    res.status(200).json({ token, user: { username: user.username, role: user.role, id: user._id } });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
