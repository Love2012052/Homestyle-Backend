const User = require("../models/userSchema");

class CartController {
  static addProductToCart = async (req, res) => {
    try {
      const _id = req.user._id;
      const productDetails = req.body;
      const user = await User.findById(_id);
      if (
        user.cartDetails.products.some(
          (obj) => obj.productId === productDetails.productId
        )
      ) {
        user.cartDetails.products = user.cartDetails.products.map((obj) => {
          if (obj.productId === productDetails.productId) {
            user.cartDetails.totalPrice =
              user.cartDetails.totalPrice -
              obj.quantity * obj.price +
              productDetails.quantity * productDetails.price;
            return { ...obj, quantity: productDetails.quantity };
          }
          return obj;
        });
      } else {
        user.cartDetails.products =
          user.cartDetails.products.concat(productDetails);
        user.cartDetails.totalPrice =
          user.cartDetails.totalPrice +
          productDetails.quantity * productDetails.price;
      }
      await user.save();
      res.status(200).json({
        message: "Item successfully added to your cart!",
        status: 200,
      });
    } catch (err) {
      res.status(500).json({
        message: "Something went wrong with the server!",
        status: 500,
      });
    }
  };

  static removeProductFromCart = async (req, res) => {
    try {
      const productId = req.params.productId;
      const _id = req.user._id;
      const user = await User.findById(_id);
      user.cartDetails.products = user.cartDetails.products.filter(function (
        obj
      ) {
        if (obj.productId === productId) {
          user.cartDetails.totalPrice =
            user.cartDetails.totalPrice - obj.quantity * obj.price;
        }
        return obj.productId !== productId;
      });
      await user.save();
      res.status(200).json({
        message: "Item deleted successfully!",
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

module.exports = CartController;
