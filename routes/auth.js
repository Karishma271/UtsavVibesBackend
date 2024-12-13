router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Input validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found.' });
    }

    // Trim password to remove leading/trailing spaces
    const trimmedPassword = password.trim();

    // Log the input password and the hashed password from the database
    console.log('Input password:', trimmedPassword);
    console.log('Stored hashed password:', user.password);

    // Compare the hashed password with the stored hash
    const isMatch = await bcrypt.compare(trimmedPassword, user.password);

    console.log('Password match result:', isMatch); // Log result

    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password.' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Return success response with token
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