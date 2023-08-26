const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/productController");

router.post("/createProduct", ProductController.createProduct);

router.get("/getAllProducts", ProductController.getAllProducts);

router.get(
  "/getOneProductDetails/:_id",
  ProductController.getOneProductDetails
);

module.exports = router;
