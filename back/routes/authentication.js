// new authentication router for authentication routes
const express = require("express");
const router = express.Router();

// import user model
const User = require("../models/User.js");

// POST to signup route

router.post("/signup", async (req, res) => {
  // make it async  ────┘
  console.log(req.body);

  try {
    // talking to the database is asynchronous so we use await to say we want to wait for the result. remember to make the callback function async
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
