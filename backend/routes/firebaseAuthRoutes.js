const express = require("express");
const router = express.Router();
const User = require("../models/User");

/**
 * Store Firebase user role in MongoDB
 */
router.post("/firebase-register", async (req, res) => {
  try {
    const { email, uid, role } = req.body;

    if (!email || !uid || !role) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ message: "User already exists" });
    }

    const user = new User({
      email,
      firebaseUID: uid,
      role,
      activeJobs: role === "Technician" ? 0 : undefined
    });

    await user.save();
    res.json({ message: "User stored in MongoDB" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
