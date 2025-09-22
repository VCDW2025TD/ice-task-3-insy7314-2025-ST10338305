// Import the jsonwebtoken package to create and verify JWT tokens
const jwt = require("jsonwebtoken");

// Import the User model to interact with the users collection in MongoDB
const User = require("../models/User");

// Helper function to generate a JWT token using the user's ID + role
const generateToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role },    // Payload: ID + role
    process.env.JWT_SECRET,              // Secret key from .env file
    { expiresIn: "1h" }                  // Token expires in 1 hour
  );

// Controller: handles user registration
exports.register = async (req, res) => {
  const { email, password, role } = req.body; // role is optional, defaults to "reader"

  try {
    // Check if the email already exists
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    // Create a new user (password gets hashed via pre-save hook)
    const user = await User.create({ email, password, role });

    // Generate JWT with role
    const token = generateToken(user);

    // Respond with token and user info
    res.status(201).json({
      token,
      user: { id: user._id, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Controller: handles user login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Look up user
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT with role
    const token = generateToken(user);

    res.json({
      token,
      user: { id: user._id, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Controller: Admin-only route to create new users
exports.adminCreateUser = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    // Only allow Admin role creation via secure route/middleware (check in routes)
    const user = await User.create({ email, password, role });

    res.status(201).json({
      id: user._id,
      email: user.email,
      role: user.role
    });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: "Email already exists" });
    res.status(500).json({ error: "Server error" });
  }
};
