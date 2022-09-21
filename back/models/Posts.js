const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  image: {
    data: Buffer,
    contentType: String,
  },
  author: {
    // author field must be a User id //WIP ADD AUTHOR TO POST CREATION
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Post", postSchema);
