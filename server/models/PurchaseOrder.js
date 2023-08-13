const { Schema, model } = require("mongoose");

const schema = new Schema({
  timestamp: { type: String, required: true},
  requestor: { type: String, required: true},
  description: { type: String, required: true},
  amount: { type: Number, required: true},
  costcenter: { type: String, required: true},
  budget: { type: String, required: true},
  status: { type: String, enum: ["Approved", "Rejected", "Pending", "Info requested"]}
}, {
  timestamps: true
});

module.exports = model("PurchaseOrder", schema);