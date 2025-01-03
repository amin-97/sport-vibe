// server/routes/auth.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/google", async (req, res) => {
  try {
    console.log("Received auth request:", req.body); // Debug log

    const { googleId, email, displayName, photoURL } = req.body;

    if (!googleId || !email) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find or create user
    let user = await User.findOne({ googleId });

    if (!user) {
      // Create new user
      user = new User({
        googleId,
        email,
        displayName,
        photoURL,
      });
      await user.save();
      console.log("New user created:", user); // Debug log
    } else {
      // Update last login
      user.lastLogin = new Date();
      await user.save();
      console.log("Existing user updated:", user); // Debug log
    }

    res.json({ user });
  } catch (error) {
    console.error("Auth error:", error);
    res
      .status(500)
      .json({ message: "Authentication failed", error: error.message });
  }
});

module.exports = router;
