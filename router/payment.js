const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

router.post("/checkout", async (req, res) => {
  const options = {
    amount: Number(req.body.amount * 100),
    currency: "INR",
  };
  const order = await instance.orders.create(options);
  res.status(200).json({
    data: order,
    status: 200,
  });
});

router.post("/paymentVerification", async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
    req.body;
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;
  if (isAuthentic) {
    res.status(200).json({
      data: req.body,
      success: true,
      status: 200,
    });
  } else {
    res.status(200).json({
      success: false,
      status: 200,
    });
  }
});

router.get("/getKey", (req, res) => {
  res.status(200).json({
    key: process.env.RAZORPAY_API_KEY,
    status: 200,
  });
});

module.exports = router;
