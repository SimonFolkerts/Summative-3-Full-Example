const express = require("express");
const router = express.Router();

// import the post model
const Post = require("../models/Posts.js");

router.post("/", (req, res) => {
  console.log(req.body);
  // create a new document from the post model using the request data
  // exclude image for now, will add later
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    // TODO add images
  });

  // save the new document, and once complete, send back the new document to the client
  post.save(() => {
    res.json(post);
  });
});

module.exports = router;
