// server/routes/auth.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken"); // Add this

router.post("/google", async (req, res) => {
  try {
    console.log("Received auth request:", req.body);

    const { googleId, email, displayName, photoURL } = req.body;

    if (!googleId || !email) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find or create user
    let user = await User.findOne({ googleId });

    if (!user) {
      user = new User({
        googleId,
        email,
        displayName,
        photoURL,
      });
      await user.save();
      console.log("New user created:", user);
    } else {
      user.lastLogin = new Date();
      await user.save();
      console.log("Existing user updated:", user);
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({ user, token }); // Return both user and token
  } catch (error) {
    console.error("Auth error:", error);
    res
      .status(500)
      .json({ message: "Authentication failed", error: error.message });
  }
});

module.exports = router;
