const express = require("express");
const router = express.Router();

const {
  getProductById,
  getProductDetailsById,
} = require("../controllers/productController");

router.route("/:id").get(getProductById);
router.route("/:id/details").get(getProductDetailsById);

module.exports = router;
