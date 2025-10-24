const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  foodId: String,
  name: String,
  qty: Number,
  priceCents: Number,
}, { _id: false });

const orderSchema = new mongoose.Schema({
  items: [orderItemSchema],
  booking: {type: Object},
  totals: { subtotal: Number, tax: Number, total: Number },
  status: { type: String, default: "CONFIRMED" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
