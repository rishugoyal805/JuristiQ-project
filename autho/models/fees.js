const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/miniproject");
const FeesSchema = new mongoose.Schema({
  case_ref_no: { type: Number, required: true, unique: true },
  clientName: { type: String, required: true },
  fees: { type: Number, required: true },
  amount_paid: { type: Number, required: true },
  pending_fees: { type: Number, required: true },
  payment_mode: { type: String, required: true },
  due_date: { type: Date, required: true },
  remarks: { type: String },
});

const FeesModel = mongoose.model("Fees", FeesSchema);
module.exports = FeesModel;
