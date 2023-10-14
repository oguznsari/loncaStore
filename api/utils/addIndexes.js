const mongoose = require("mongoose");
const Vendor = require("../models/Vendor");
const Order = require("../models/Order");

const dotenv = require("dotenv").config({ path: "../.env" });

const connectDB = require("../db/connect");

async function createIndexes() {
  try {
    await connectDB(process.env.MONGO_URI);

    await Vendor.createIndexes();
    await Order.createIndexes();
    console.log("Indexes created successfully.");
  } catch (error) {
    console.error("Error creating indexes: ", error);
  } finally {
    // Close the database connection after creating indexes
    await mongoose.disconnect();
  }
}

createIndexes();
