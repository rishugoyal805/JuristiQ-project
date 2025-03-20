const mongoose = require('mongoose');


const casesSchema = mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "user", 
        required: true // Ensures each case is associated with a user
    },  
    caseTitle: String, // caseTitle should not reference user, keeping it as a String
    clientName: String,
    status: { 
        type: String, 
        enum: ['Closed', 'Active', 'Pending', 'Won'] 
    }, 
    nextHearing: Date,
    case_ref_no: Number,
    fees: Number,
    pending_fees: Number,
  
});

module.exports = mongoose.model('cases', casesSchema);
