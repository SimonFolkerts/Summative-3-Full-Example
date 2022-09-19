// new authentication router for authentication routes
const express = require("express");
const router = express.Router();

// add jsonwebtoken so that we can create a secure token
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// import user model
const User = require("../models/User.js");

// JWT (we will need to install `jsonwebtoken`)
// set expire time for token (this is in seconds)
const maxAge = 3 * 24 * 60 * 60; // 3 days
// create json web token function
function createToken(id) {
  return jwt.sign({ id }, "asdflkasjdf", {
    expiresIn: maxAge,
  });
}

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
    // try to find a user with a matching username
    const user = await User.findOne({ username: req.body.username });
    console.log(user);
    // if no user is found, throw an error, ending the try/catch and passing it to the catch block
    if (!user) {
      throw Error("no such user");
    } else {
      // otherwise if there is a user, check their password using bcrypt
      const auth = await bcrypt.compare(req.body.password, user.password);
      // if not the right password, throw an error
      if (!auth) {
        throw Error("incorrect password");
      } else {
        // if a match is found, issue a new token and send it down to the client by attaching it as the value of a cookie to the response
        // create a new token using the above function and encode the user ID into it
        const token = createToken(user._id);
        // attach a cookie to the response that contains the json web token (httpOnly makes it inaccessible to the js of the client, and maxage of the token is used (multiplied by 1000 since it is in ms)
        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json(user);
      }
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
