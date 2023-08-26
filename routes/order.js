const authenticate = require("../middleware/authenticate");
const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/orderController");

router.get(
  "/getOneOrderDetails/:orderId",
  authenticate,
  OrderController.getOneOrderDetails
);

router.patch(
  "/storeShippingDetails",
  authenticate,
  OrderController.storeShippingDetails
);

module.exports = router;
