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
const requireAuth = require("../middleware/authMiddleware.js");
const { populate } = require("../models/Posts.js");

// endpoint can now read and save a file with a fieldname of image
router.post("/", requireAuth, upload.single("image"), (req, res) => {
  // create a new document from the post model using the request data
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    image: req.file
      ? {
          // the image is read from the upload folder where multer put it
          data: fs.readFileSync(path.join("./uploads/" + req.file.filename)),
          // inform of what type of file it is
          contentType: "image/png",
        }
      : null,
    author: req.body.author,
  });

  // save the new document, and once complete, send back the new document to the client
  post.save(() => {
    // delete the file from the uploads folder once database storage is complete
    fs.unlinkSync(path.join("./uploads/" + req.file.filename));
    res.json(post);
  });
});

router.put("/:id", upload.single("image"), (req, res) => {
  const data = {
    title: req.body.title,
    content: req.body.content,
  };

  if (req.file) {
    data.image = {
      // the image is read from the upload folder where multer put it
      data: fs.readFileSync(path.join("./uploads/" + req.file.filename)),
      // inform of what type of file it is
      contentType: "image/png",
    };
  }
  console.log(data);
  const post = Post.findByIdAndUpdate(req.params.id, data, () => {
    if (req.file) {
      fs.unlinkSync(path.join("./uploads/" + req.file.filename));
    }
    res.json({ message: "updated" });
  });
});

router.get("/", async (req, res) => {
  // when getting the list of posts, because the author field is an objectId referring to a user, we can use populate() to load that user into the result for each post
  // here we are requesting the author document be loaded into the post document, but only with the username
  const posts = await Post.find({}).populate("author", "username").lean();
  // send the data back to the client
  res.json(posts);
});

router.get("/:id", async (req, res) => {
  const post = await Post.findById(req.params.id).populate("author").lean();
  res.json(post);
});

router.delete("/:id", requireAuth, async (req, res) => {
  const deleted = await Post.findByIdAndDelete(req.params.id);
  res.json(deleted);
});

module.exports = router;
