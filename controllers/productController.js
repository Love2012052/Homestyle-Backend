const Product = require("../models/productSchema");

class ProductController {
  static createProduct = async (req, res) => {
    const { name, category, price, status, description, imageUrl } = req.body;
    try {
      const product = new Product({
        name,
        category,
        price,
        status,
        description,
        imageUrl,
      });
      await product.save();
      res
        .status(200)
        .json({ message: "Product added successfully!", status: 200 });
    } catch (err) {
      if (err.name == "ValidationError") {
        for (field in err.errors) {
          res
            .status(422)
            .json({ message: err.errors[field].message, status: 422 });
          break;
        }
      } else {
        res.status(500).json({
          message: "Something went wrong with the server!",
          status: 500,
        });
      }
    }
  };

  static getAllProducts = async (req, res) => {
    try {
      const products = await Product.find(
        {},
        { name: 1, category: 1, price: 1, imageUrl: 1 }
      );
      res.status(200).json({
        data: products,
        status: 200,
      });
    } catch (err) {
      res.status(500).json({
        message: "Something went wrong with the server!",
        status: 500,
      });
    }
  };

  static getOneProductDetails = async (req, res) => {
    try {
      const _id = req.params._id;
      const product = await Product.findById(_id);
      res.status(200).json({
        data: product,
        status: 200,
      });
    } catch (err) {
      res.status(500).json({
        message: "Something went wrong with the server!",
        status: 500,
      });
    }
  };
}

module.exports = ProductController;
