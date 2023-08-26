const User = require("../models/userSchema");

class OrderController {
  static getOneOrderDetails = async (req, res) => {
    try {
      const orderId = req.params.orderId;
      const _id = req.user._id;
      const user = await User.findById(_id);
      let order;
      user.orderDetails = user.orderDetails.map((obj) => {
        if (obj.orderId === orderId) {
          order = obj;
        }
        return obj;
      });
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

  static storeShippingDetails = async (req, res) => {
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
        status: 200,
      });
    } catch (err) {
      if (err.name == "ValidationError") {
        for (let field in err.errors) {
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
}

module.exports = OrderController;
