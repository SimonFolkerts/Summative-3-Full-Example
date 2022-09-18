const mongoose = require("mongoose");

// define user schema for user documents
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    // only alphanumeric, form 4 to 10 chars
    match: /^[a-zA-Z0-9]{4,10}$/,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
});

// create and export a user model based on the user schema. This model will be used to talk to mongoose by importing it into routes
module.exports = mongoose.model("User", userSchema);
