const { Schema, model } = require("mongoose");

const schema = new Schema({
  timestamp: { type: Date },
  requestor: {
    email: { type: String },
    _id: { type: Schema.Types.ObjectId, ref: "User", required: true }
  },
  title: { type: String },
  description: { type: String },
  amount: { type: Number, required: true},
  costCenter: { type: Schema.Types.ObjectId, ref: "CostCenter", required: true},
  budget: { type: String, required: true},
  status: { type: String, enum: ["Approved", "Declined", "Pending", "Info requested"]}
}, {
  timestamps: true
});

module.exports = model("PurchaseOrder", schema);
