const Order = require("../models/Order");
const { StatusCodes } = require("http-status-codes");

const getOrders = async (req, res) => {
  const orders = await Order.find({}).limit(200);
  res.status(StatusCodes.OK).json({ orders, count: orders.length });
};

const getOrderById = async (req, res) => {
  const { id: orderId } = req.params;
  const order = await Order.findOne({ _id: orderId });
  if (!order) {
    res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: `No order found with id ${orderId}` });
  }

  res.status(StatusCodes.OK).json({ order });
};

module.exports = { getOrders, getOrderById };
