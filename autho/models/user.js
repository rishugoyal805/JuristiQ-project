const mongoose = require("mongoose");
// mongoose.connect("mongodb+srv://swayamsam2005:sLDNreRmb5R0KjQH@cluster0.ipxl289.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
require("../db"); // Import the connection file
const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  email: { type: String, required: true, unique: true },
  password:{type: String},
  contact: { type: String, default: "" },
  casesHandled: { type: Number, default: 0 },
  casesWon: { type: Number, default: 0 },
  profilePic: { type: String, default: "" },
  otp: { type: Number, default: null },
  secretString:{type: String},
  cases: [{ type: mongoose.Schema.Types.ObjectId, ref: "cases" }],
  client: [{ type: mongoose.Schema.Types.ObjectId, ref: "client" }],
  fees: [{ type: mongoose.Schema.Types.ObjectId, ref: "fees" }],
});

module.exports = mongoose.model("user", userSchema);
