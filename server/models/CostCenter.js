const { Schema, model } = require ("mongoose");

const schema = new Schema({
  title: { type: String },
  limit: { type: Number },
  managers: [{ type: Schema.Types.ObjectId, ref: "User" }]
  }, {
  timestamps: true
});

module.exports = model("CostCenter", schema);
