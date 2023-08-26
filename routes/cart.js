const authenticate = require("../middleware/authenticate");
const express = require("express");
const router = express.Router();
const CartController = require("../controllers/cartController");

router.post("/addProductToCart", authenticate, CartController.addProductToCart);

router.delete(
  "/removeProductFromCart/:productId",
  authenticate,
  CartController.removeProductFromCart
);

module.exports = router;
