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

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found");
      return res.status(400).json({ message: "Invalid email or password" });
    }

    console.log("Stored Hashed Password:", user.password); // Log stored password

    // Compare entered password with stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password Match Result:", isMatch); // Log the result

    if (!isMatch) {
      console.log("Password comparison failed");
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // If the password matches, generate a JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET, // Replace with your JWT secret key
      { expiresIn: '1h' } // Optional: expiry time of the token
    );

    // Respond with the token and user information
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      }
    });

  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
module.exports = router;
