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

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  console.log("Received login request with username:", username); // Add this log to check the received data

  try {
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      console.log('User not found'); // Log if the user is not found
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      console.log('Password mismatch'); // Log if the password doesn't match
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    const token = jwt.sign({ username: user.username, role: user.role, id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    res.status(200).json({
      message: 'Login successful.',
      token,
      user: { username: user.username, role: user.role, email: user.email, phone: user.phone, id: user._id },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

module.exports = router;
