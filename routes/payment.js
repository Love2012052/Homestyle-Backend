const authenticate = require("../middleware/authenticate");
const express = require("express");
const router = express.Router();
const PaymentController = require("../controllers/paymentController");

router.post("/checkout", PaymentController.checkout);

router.get("/getKey", PaymentController.getKey);

router.post(
  "/paymentVerification",
  authenticate,
  PaymentController.paymentVerification
);

module.exports = router;
