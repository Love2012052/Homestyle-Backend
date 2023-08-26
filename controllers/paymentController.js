const crypto = require("crypto");
const Razorpay = require("razorpay");
const User = require("../models/userSchema");

class PaymentController {
  static checkout = async (req, res) => {
    try {
      const instance = new Razorpay({
        key_id: process.env.RAZORPAY_API_KEY,
        key_secret: process.env.RAZORPAY_API_SECRET,
      });
      const options = {
        amount: Number(req.body.totalPrice * 100),
        currency: "INR",
      };
      const order = await instance.orders.create(options);
      res.status(200).json({
        data: order,
        status: 200,
      });
    } catch (err) {
      res.status(500).json({
        message: "Something went wrong with the server!",
        status: 500,
      });
    }
  };

  static getKey = (req, res) => {
    res.status(200).json({
      key: process.env.RAZORPAY_API_KEY,
      status: 200,
    });
  };

  static paymentVerification = async (req, res) => {
    try {
      const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
        req.body;
      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
        .update(body.toString())
        .digest("hex");
      const isAuthentic = expectedSignature === razorpay_signature;
      if (isAuthentic) {
        const _id = req.user._id;
        const user = await User.findById(_id);
        const order = {
          fullName: user.fullName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          cartDetails: user.cartDetails,
          orderId: razorpay_order_id,
          shippingDetails: user.shippingDetails[0],
        };
        user.orderDetails = user.orderDetails.concat(order);
        user.cartDetails.products = [];
        user.cartDetails.totalPrice = 0;
        await user.save();
        res.status(200).json({
          message: "Order placed successfully! Enjoy your purchase!",
          status: 200,
        });
      } else {
        res.status(400).json({
          message: "Order not placed! Please try again later!",
          status: 400,
        });
      }
    } catch (err) {
      res.status(500).json({
        message: "Something went wrong with the server!",
        status: 500,
      });
    }
  };
}

module.exports = PaymentController;
