const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/miniproject");

const userSchema = mongoose.Schema({
  name: String,
  age: Number,
  email: String,
  password: String,
  contact: String, // Add contact field
  casesHandled: Number, // Add casesHandled field
  casesWon: Number, // Add casesWon field
  profilePic: String, // Add profilePic field
  otp: Number,
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "post" }]
});

module.exports = mongoose.model("user", userSchema);
