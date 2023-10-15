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
  let productNames = [];
  let productIds = [];
  products.forEach((product) => {
    productNames[product._id.toString()] = product.name;
    productIds.push(product._id);
  });

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
        "cart_item.product": { $in: productIds },
      },
    },
    {
      $group: {
        _id: {
          order_status: "$cart_item.order_status",
          month: { $month: "$payment_at" },
          year: { $year: "$payment_at" },
          product: "$cart_item.product",
        },
        count: { $sum: 1 }, // Count
        totalPackQuantity: { $sum: "$cart_item.quantity" }, // Total quantity of products
        totalIndividualQuantity: {
          $sum: { $multiply: ["$cart_item.quantity", "$cart_item.item_count"] },
        }, // Total individual orders
        totalCOG: { $sum: "$cart_item.cogs" }, // Total COG
        totalPrice: { $sum: "$cart_item.price" }, // Total price
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
        product: "$_id.product",
      },
    },
  ];

  const result = await Order.aggregate(pipeline);

  // organize data in monthly manner
  let modifiedResult = {};
  let totalOrders = 0;
  result.forEach((item) => {
    const month = item.month;

    // Initialize the month object if it doesn't exist
    if (!modifiedResult[month]) {
      modifiedResult[month] = {
        totalPackQty: 0,
        totalIndQty: 0,
        totalCOG: 0,
        totalRevenue: 0,
        products: [],
      };
    }

    // Accumulate values for the current month
    modifiedResult[month].totalPackQty += item.totalPackQuantity;
    modifiedResult[month].totalIndQty += item.totalIndividualQuantity;
    modifiedResult[month].totalCOG += item.totalCOG;
    modifiedResult[month].totalRevenue += item.totalRevenue;
    totalOrders += item.totalPackQuantity;

    // Add product details for the current month
    modifiedResult[month].products.push({
      productId: item.product,
      qty: item.totalPackQuantity,
      name: productNames[item.product],
    });
  });
  modifiedResult = {
    totalOrders,
    year,
    months: modifiedResult,
  };

  res.status(StatusCodes.OK).json(modifiedResult);
};

const allTimeVendorProductsStats = async (req, res) => {
  const { id: vendorId } = req.params;

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

  const vendor = await Vendor.findOne({ _id: vendorId });
  // Find all products related to the vendor
  const products = await Product.find({ vendor: vendorId });
  if (!products || products.length === 0) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: `No products found for vendor with id ${vendorId}` });
  }

  let productNames = [];
  let productIds = [];
  products.forEach((product) => {
    productNames[product._id.toString()] = product.name;
    productIds.push(product._id);
  });

  const pipeline = [
    {
      $match: {
        "cart_item.product": { $in: productIds },
      },
    },
    {
      $unwind: "$cart_item",
    },
    {
      $match: {
        "cart_item.order_status": orderStatus,
        "cart_item.product": { $in: productIds },
      },
    },
    {
      $group: {
        _id: {
          product: "$cart_item.product",
        },
        count: { $sum: "$cart_item.quantity" }, // Sum of quantities
      },
    },
    {
      $project: {
        _id: 0,
        product: "$_id.product",
        count: 1,
      },
    },
    {
      $sort: { count: -1 }, // Sort by count in descending order
    },
    {
      $group: {
        _id: null,
        results: { $push: "$$ROOT" }, // Collect results
        totalCount: { $sum: "$count" }, // Calculate total count
      },
    },
    {
      $lookup: {
        from: "products", // Replace with the actual name of the product collection
        localField: "results.product",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    {
      $project: {
        _id: 0,
        results: 1,
        totalCount: 1,
      },
    },
  ];

  const result = await Order.aggregate(pipeline);

  if (result.length === 0) {
    return res.status(StatusCodes.NOT_FOUND).json({
      msg: "No product statistics found for this vendor",
    });
  }

  // Modify the result to include count, id, and name directly under the result
  const modifiedResult = result[0].results.map((item) => {
    return {
      count: item.count,
      id: item.product,
      name: productNames[item.product] ?? "N/A",
    };
  });

  res.status(StatusCodes.OK).json({
    vendorId,
    vendorName: vendor.name,
    orderStatus,
    totalCount: result[0].totalCount,
    products: modifiedResult,
  });
};

module.exports = {
  getVendors,
  getVendorById,
  getAllProductsByVendor,
  getMonthlyProductDetails,
  allTimeVendorProductsStats,
};
