const User = require("../models/userSchema");

class UserController {
  static checkSignIn = async (req, res) => {
    try {
      res.status(200).json({
        status: 200,
      });
    } catch (err) {
      res.status(500).json({
        message: "Something went wrong with the server!",
        status: 500,
      });
    }
  };

  static getUserDetails = async (req, res) => {
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
  };

  static updateProfile = async (req, res) => {
    try {
      const _id = req.user._id;
      const { fullName, email, phoneNumber } = req.body;
      const signInUser = await User.findById(_id);
      const userData = await User.findOne({ email });
      if (userData && signInUser.email !== email) {
        res.status(409).json({ message: "Email already exists!", status: 409 });
      } else {
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
      }
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

module.exports = UserController;
