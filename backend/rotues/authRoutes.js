const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Simple login
router.post("/login", async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
});

module.exports = router;
