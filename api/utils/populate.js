const mongoose = require("mongoose");
const {
  Types: { ObjectId },
} = require("mongoose");
const fs = require("fs");

const dotenv = require("dotenv").config({ path: "../.env" });

const connectDB = require("../db/connect");

const Vendor = require("../models/Vendor");
const Product = require("../models/Product");
const Order = require("../models/Order");

const vendorDataPath = "../mockData/vendors.json";
const productDataPath = "../mockData/parent_products.json";
const orderDataPath = "../mockData/orders.json";

async function populateColletion(model, data) {
  try {
    // await model.insertMany(data);
    const organizedData = data.map((item) => {
      item._id = item._id.$oid;
      if (item.vendor) {
        item.vendor = item.vendor.$oid;
      }
      if (item.payment_at) {
        item.payment_at = item.payment_at.$date.$numberLong;
      }
      if (item.cart_item) {
        item.cart_item = item.cart_item.map((card_item) => {
          const updatedCardItem = {
            ...card_item,
            product: card_item.product ? card_item.product.$oid : null,
            variantId: card_item.variantId.$oid,
            _id: card_item._id.$oid,
          };
          return updatedCardItem;
        });
      }
      return item;
    });

    await model.insertMany(organizedData);
    console.log(`Data populated for model: ${model.modelName}`);
  } catch (error) {
    console.log(`Error while populating for model: ${model.modelName}`, error);
  }
}

async function readDataFile(filePath) {
  try {
    const data = await fs.promises.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.log(`Error while reading file ${filePath}`, error);
  }
}

async function populate() {
  try {
    const vendorData = await readDataFile(vendorDataPath);
    const productData = await readDataFile(productDataPath);
    const orderData = await readDataFile(orderDataPath);

    await connectDB(process.env.MONGO_URI);

    console.log(
      "Please compare the entity count below with your db count and confirm all data created successfully!"
    );

    const dataCounts = [
      { Entity: "Vendor", Count: vendorData.length },
      { Entity: "Product", Count: productData.length },
      { Entity: "Order", Count: orderData.length },
    ];

    console.table(dataCounts);

    await populateColletion(Vendor, vendorData);
    await populateColletion(Product, productData);
    await populateColletion(Order, orderData);

    console.log("Data populated successfully.");
  } catch (error) {
    console.error("Error: ", error);
  } finally {
    mongoose.disconnect();
  }
}

populate();
