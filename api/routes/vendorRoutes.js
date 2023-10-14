const express = require("express");
const router = express.Router();

const {
  getVendorById,
  getVendors,
  getAllProductsByVendor,
  getMonthlyProductDetails,
} = require("../controllers/vendorController");

router.route("/").get(getVendors);
router.route("/:id").get(getVendorById);
router.route("/:id/products").get(getAllProductsByVendor);
router.route("/:id/yearSummary/:year").get(getMonthlyProductDetails);

module.exports = router;
