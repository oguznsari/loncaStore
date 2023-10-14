const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
  },
});

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
