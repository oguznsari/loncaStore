const express = require("express");
const router = express.Router();

const { getOrders, getOrderById } = require("../controllers/orderController");

router.route("/").get(getOrders);
router.route("/:id").get(getOrderById);

module.exports = router;
