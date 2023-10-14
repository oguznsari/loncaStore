const mongoose = require("mongoose");

// Define the Mongoose schema for the "CartItem" model
const CartItemSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  variantId: { type: mongoose.Schema.Types.ObjectId, ref: "Variant" },
  series: String,
  item_count: Number,
  quantity: Number,
  cogs: Number,
  price: Number,
  order_status: String,
  is_sample: Boolean,
  desi: Number,
  vat: Number,
});

// Define the Mongoose schema for the "Order" model
const OrderSchema = new mongoose.Schema({
  cart_item: [CartItemSchema], // Use the "cartItemSchema" as a subdocument
  payment_at: Date,
});

// Create the "Order" model
const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
