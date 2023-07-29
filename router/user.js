const authenticate = require("../middleware/authenticate");
const express = require("express");
const router = express.Router();
const User = require("../models/userSchema");

router.post("/addProductToCart", authenticate, async (req, res) => {
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
});

router.get("/getUserDetails", authenticate, async (req, res) => {
  try {
    const _id = req.user._id;
    const user = await User.findById(_id);
    res.status(200).json({
      data: user,
      status: 200,
    });
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong with the server!",
      status: 500,
    });
  }
});

router.delete(
  "/removeProductFromCart/:productId",
  authenticate,
  async (req, res) => {
    try {
      const _id = req.user._id;
      const productId = req.params.productId;
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
  }
);

router.post("/sendMessage", authenticate, async (req, res) => {
  try {
    const _id = req.user._id;
    const user = await User.findById(_id);
    await user.message(req.body);
    res
      .status(200)
      .json({ message: "Message sent successfully!", status: 200 });
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
});

router.patch("/storeShippingDetails", authenticate, async (req, res) => {
  try {
    const _id = req.user._id;
    const user = await User.findByIdAndUpdate(
      _id,
      {
        shippingDetails: [req.body],
      },
      { new: true }
    );
    await user.save();
    res.status(200).json({
      message: "Profile updated successfully!",
      status: 200,
    });
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
});

router.patch("/updateProfile", authenticate, async (req, res) => {
  try {
    const _id = req.user._id;
    const { fullName, email, phoneNumber } = req.body;
    const user = await User.findByIdAndUpdate(
      _id,
      {
        fullName,
        email,
        phoneNumber,
      },
      {
        new: true,
      }
    );
    await user.save();
    res.status(200).json({
      message: "Profile updated successfully!",
      status: 200,
    });
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
});

module.exports = router;
