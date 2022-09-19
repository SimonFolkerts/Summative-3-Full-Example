// new authentication router for authentication routes
const express = require("express");
const router = express.Router();

// import user model
const User = require("../models/User.js");

// POST to signup route

router.post("/signup", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    console.log(error.message, error.code);
    res.status(400).json({ message: error.message });
  }
});

// POST to login route
router.post("/login", (req, res) => {
  console.log(req.body);
  res.json({ message: "login" });
});

module.exports = router;
