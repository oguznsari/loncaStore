const Vendor = require("../models/Vendor");
const Product = require("../models/Product");
const Order = require("../models/Order");
const { StatusCodes } = require("http-status-codes");

const validOrderStatuses = [
  "Confirmed",
  "Received",
  "Reviewed",
  "Returned",
  "StockIn",
  "StockOut",
  "Supplier Return",
];

const getVendors = async (req, res) => {
  const vendors = await Vendor.find({}).limit(200);
  res.status(StatusCodes.OK).json({ vendors, count: vendors.length });
};

const getVendorById = async (req, res) => {
  const { id: vendorId } = req.params;

  const vendor = await Vendor.findOne({ _id: vendorId });
  if (!vendor) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: `No vendor found with id ${vendorId}` });
  }

  res.status(StatusCodes.OK).json({ vendor });
};

const getAllProductsByVendor = async (req, res) => {
  const { id: vendorId } = req.params;

  const vendor = await Vendor.findOne({ _id: vendorId });
  if (!vendor) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: `No vendor found with id ${vendorId}` });
  }

  const products = await Product.find({ vendor: vendorId });
  res.status(StatusCodes.OK).json({ products, count: products.length });
};

const getMonthlyProductDetails = async (req, res) => {
  const { year, id: vendorId } = req.params; // Assuming you get the year and vendorId from the request

  let orderStatus = "Confirmed";
  if (req.body.order_status) {
    if (validOrderStatuses.includes(req.body.order_status)) {
      orderStatus = req.body.order_status;
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: `Invalid order_status provided, please provide valid status: ${validOrderStatuses.join(
          ", "
        )}`,
      });
    }
  }

  // First, find all products related to the vendor
  const products = await Product.find({ vendor: vendorId });

  if (!products || products.length === 0) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: `No products found for vendor with id ${vendorId}` });
  }

  // Get an array of product IDs
  const productIds = products.map((product) => product._id);

  // Create a pipeline to aggregate the data
  const pipeline = [
    {
      $match: {
        "cart_item.product": { $in: productIds },
        payment_at: {
          $gte: new Date(`${year}-01-01`),
          $lt: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $unwind: "$cart_item",
    },
    {
      $match: {
        "cart_item.order_status": orderStatus, // Filter
      },
    },
    {
      $group: {
        _id: {
          order_status: "$cart_item.order_status",
          month: { $month: "$payment_at" },
          year: { $year: "$payment_at" },
        },
        count: { $sum: 1 }, // Count
        totalPackQuantity: { $sum: "$cart_item.quantity" }, // Total quantity of products
        totalIndividualQuantity: {
          $sum: { $multiply: ["$cart_item.quantity", "$cart_item.item_count"] },
        }, // Total individual orders
        totalCOG: { $sum: "$cart_item.cogs" }, // Total COG
        totalPrice: { $sum: "$cart_item.price" }, // Total price
        productsOrdered: { $addToSet: "$cart_item.product" }, // Collect unique product IDs ordered in this month
      },
    },
    {
      $project: {
        _id: 0,
        order_status: "$_id.order_status",
        month: "$_id.month",
        year: "$_id.year",
        count: 1,
        totalPackQuantity: 1,
        totalIndividualQuantity: 1,
        totalCOG: 1,
        totalPrice: 1,
        totalRevenue: { $subtract: ["$totalPrice", "$totalCOG"] },
        productsOrdered: 1,
      },
    },
  ];

  // Perform a lookup to retrieve product names based on product IDs
  pipeline.push({
    $lookup: {
      from: "products", // Replace with the actual name of the product collection
      localField: "productsOrdered",
      foreignField: "_id",
      as: "productDetails",
    },
  });

  const result = await Order.aggregate(pipeline);

  res.status(StatusCodes.OK).json(result);
};

module.exports = {
  getVendors,
  getVendorById,
  getAllProductsByVendor,
  getMonthlyProductDetails,
};
