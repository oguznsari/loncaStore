const Product = require("../models/Product");
const Order = require("../models/Order");
const mongoose = require("mongoose");
const { StatusCodes } = require("http-status-codes");

const getProductById = async (req, res) => {
  const { id: productId } = req.params;

  const product = await Product.findOne({ _id: productId });
  if (!product) {
    res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: `No product found with id ${productId}` });
  }

  res.status(StatusCodes.OK).json({ product });
};

const getProductDetailsById = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOne({ _id: productId });
  if (!product) {
    res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: `No product found with id ${productId}` });
  }

  const pipeline = [
    {
      $unwind: "$cart_item",
    },
    {
      $match: {
        "cart_item.product": new mongoose.Types.ObjectId(productId),
        "cart_item.order_status": "Confirmed",
      },
    },
    {
      $group: {
        _id: "$_id", // Group by order
        count: { $sum: "$cart_item.quantity" },
        individualCount: {
          $sum: { $multiply: ["$cart_item.quantity", "$cart_item.item_count"] },
        },
      },
    },
    {
      $group: {
        _id: null,
        orderCount: { $sum: 1 }, // Count the number of orders
        packCount: { $sum: "$count" }, // Sum of counts
        individualCount: { $sum: "$individualCount" }, // Sum of individualCounts
      },
    },
  ];

  const result = await Order.aggregate(pipeline);
  const orderCount = result.length > 0 ? result[0].orderCount : 0;
  const packCount = result.length > 0 ? result[0].packCount : 0;
  const individualCount = result.length > 0 ? result[0].individualCount : 0;

  res
    .status(StatusCodes.OK)
    .json({ product, orderCount, packCount, individualCount });
};

module.exports = { getProductById, getProductDetailsById };
