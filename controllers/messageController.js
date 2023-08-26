const User = require("../models/userSchema");

class MessageController {
  static sendMessage = async (req, res) => {
    try {
      const _id = req.user._id;
      const messageDetails = req.body;
      const user = await User.findById(_id);
      user.sentMessages = user.sentMessages.concat(messageDetails);
      await user.save();
      res
        .status(200)
        .json({ message: "Message sent successfully!", status: 200 });
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

module.exports = MessageController;
