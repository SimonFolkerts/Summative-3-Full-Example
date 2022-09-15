const express = require("express");
const router = express.Router();

// multer setup
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const upload = multer({
  // setup storage
  storage: multer.diskStorage({
    // define the folder into which uploaded image goes
    destination: function (req, file, cb) {
      cb(null, "./uploads");
    },
    // define the filename to use
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
  // 5mb limit
  limits: { fileSize: 5242880 },
});

// import the post model
const Post = require("../models/Posts.js");

// endpoint can now read and save a file with a fieldname of image
router.post("/", upload.single("image"), (req, res) => {
  // create a new document from the post model using the request data
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    image: {
      // the image is read from the upload folder where multer put it
      data: fs.readFileSync(path.join("./uploads/" + req.file.filename)),
      // inform of what type of file it is
      contentType: "image/png",
    },
  });

  // save the new document, and once complete, send back the new document to the client
  post.save(() => {
    // delete the file from the uploads folder once database storage is complete
    fs.unlinkSync(path.join("./uploads/" + req.file.filename));
    res.json(post);
  });
});

router.get("/", async (req, res) => {
  const posts = await Post.find({}).lean();
  // send the data back to the client
  res.json(posts);
});

router.delete("/:id", async (req, res) => {
  const deleted = await Post.findByIdAndDelete(req.params.id);
  res.json(deleted);
});

module.exports = router;
