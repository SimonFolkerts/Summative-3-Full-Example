// new authentication router for authentication routes
const express = require("express");
const router = express.Router();

// add jsonwebtoken so that we can create a secure token
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// import user model
const User = require("../models/User.js");

// POST to signup route
router.post("/signup", async (req, res) => {
  try {
    const user = await User.create(req.body);
    // user created
    res.status(201).json({ user: user._id });
  } catch (error) {
    console.log(error.message, error.code);
    res.status(400).json({ message: error.message });
  }
});

// POST to login route
router.post("/login", async (req, res) => {
  try {
    // find user
    const user = await User.findOne({ username: req.body.username });
    console.log(user);
    if (!user) {
      // if no user, error
      throw Error("no such user");
    } else {
      // if user, check password
      const auth = await bcrypt.compare(req.body.password, user.password);
      if (!auth) {
        // if no password, error
        throw Error("incorrect password");
      } else {
        const maxAge = 3 * 24 * 60 * 60;
        // if password, issue token, attach cookie, send
        const token = jwt.sign({ id: user._id }, "asdflkasjdf", {
          expiresIn: maxAge,
        });
        res.cookie("jwt", token, {
          httpOnly: true,
          maxAge: maxAge * 1000,
          sameSite: "none",
          secure: true,
        });
        res.status(200).json(user);
      }
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
});

// for logout what should occur is the removal of the jwt cookie. This is not directly possible, but what we can do is replace it with a new jwt cookie with a very short expiry time
router.get("/logout", (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    maxAge: 1,
    sameSite: "none",
    secure: true,
  });
  res.json({ message: "hello" });
});

const requireAuth = require("../middleware/authMiddleware.js");

router.get("/authenticate", requireAuth, async (req, res) => {
  const user = await User.findById(req.token.id);
  res.json(user);
});

module.exports = router;
