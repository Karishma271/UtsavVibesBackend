const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Signup API
router.post('/signup', async (req, res) => {
  const { username, email, password, role, phone } = req.body;

  // Input validation
  if (!username || !email || !password || !role || !phone) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username is already in use.' });
    }

    // Check if the email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email is already in use.' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed password at signup:", hashedPassword);  // Log the hashed password for debugging

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

    // Respond with success message
    res.status(201).json({ message: 'Signup successful. Please log in.' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during signup.', error: error.message });
  }
});


// Login API
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Input validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    // Check if the user exists by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found.' });
    }

    // Log both the stored and input password to debug
    console.log("Input password:", password);  // input password
    console.log("Stored hashed password:", user.password);  // stored hashed password

    // Trim any unwanted spaces and compare the hashed password with the input password
    const isMatch = await bcrypt.compare(password.trim(), user.password.trim());  // trimming passwords before comparison

    // Log the result of the comparison
    console.log("Password match result:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password.' });
    }

    // Generate a JWT token if passwords match
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Return success response
    res.status(200).json({
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
});



module.exports = router;
