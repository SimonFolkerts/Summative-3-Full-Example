const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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
// this is a mongoose hook. Hooks trigger at specific points in a program. This one is set to trigger just before a save happens using the User model, i.e. this will run right before a user is saved, and it will encrypt the password field.
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// create and export a user model based on the user schema. This model will be used to talk to mongoose by importing it into routes
module.exports = mongoose.model("User", userSchema);
