const mongoose = require("mongoose");

const VendorSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
});

const Vendor = mongoose.model("Vendor", VendorSchema);

module.exports = Vendor;
