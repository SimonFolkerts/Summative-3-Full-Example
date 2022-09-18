// new authentication router for authentication routes
const express = require("express");
const router = express.Router();

// POST to signup route
router.post("/signup", (req, res) => {
  console.log(req.body);
  res.json({ message: "signup" });
});

// POST to login route
router.post("/login", (req, res) => {
  console.log(req.body);
  res.json({ message: "login" });
});

module.exports = router;
