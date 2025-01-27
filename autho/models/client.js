const mongoose = require('mongoose');


mongoose.connect("mongodb://127.0.0.1:27017/miniproject");
const clientSchema= mongoose.Schema({
  client_name: {
    type: String,
    required: true, // Ensures the client name is mandatory
    trim: true,     // Removes extra spaces
},
phone: {
    type: Number,
    required: true,
    validate: {
        validator: (value) => /^\d{10}$/.test(value), // Ensures the phone number is 10 digits
        message: "Phone number must be 10 digits",
    },
},
case_ref_no: {
    type: Number,
    required: true,
    unique: true, // Ensures each case_ref_no is unique
},
});
module.exports= mongoose.model('client', clientSchema);
