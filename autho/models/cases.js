const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/miniproject");

const casesSchema= mongoose.Schema({
  caseTitle: String,
    clientName: String,
    status: {
      type: String,
      enum: ['Closed', 'Active', 'Pending'] // Enum validation for status
      // Optionally, you can make status a required field
    },
    nextHearing: Date,
    case_ref_no: Number,
    fees: Number,
    posts: [
        { type: mongoose.Schema.Types.ObjectId, ref: "post"}
    ]
});
module.exports= mongoose.model('cases', casesSchema);
