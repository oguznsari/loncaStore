const express = require("express");
const router = express.Router();

const {
  getVendorById,
  getVendors,
  getAllProductsByVendor,
  getMonthlyProductDetails,
  allTimeVendorProductsStats,
} = require("../controllers/vendorController");

router.route("/").get(getVendors);
router.route("/:id").get(getVendorById);
router.route("/:id/products").get(getAllProductsByVendor);
router.route("/:id/yearSummary/:year").get(getMonthlyProductDetails);
router.route("/:id/allTimeStats").get(allTimeVendorProductsStats);

module.exports = router;
