const mongoose = require("mongoose");
// mongoose.connect("mongodb+srv://swayamsam2005:sLDNreRmb5R0KjQH@cluster0.ipxl289.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
require("../db"); // Import the connection file
// mongoose.connect("mongodb+srv://swayamsam2005:sLDNreRmb5R0KjQH@cluster0.ipxl289.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
//  use mongodb+srv://swayamsam2005:sLDNreRmb5R0KjQH@cluster0.ipxl289.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0 
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
  secretString: String,
  cases: [{type: mongoose.Schema.Types.ObjectId, ref: "cases"}],
  client: [{type: mongoose.Schema.Types.ObjectId, ref: "client"}],
  fees: [{type: mongoose.Schema.Types.ObjectId, ref: "fees"}],
});

module.exports = mongoose.model("user", userSchema);
