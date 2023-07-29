const bcrypt = require("bcryptjs");
const express = require("express");
const router = express.Router();
const User = require("../models/userSchema");

router.post("/signup", async (req, res) => {
  const { fullName, email, phoneNumber, password, confirmPassword } = req.body;
  try {
    const response = await User.findOne({ email });
    if (response) {
      return res
        .status(409)
        .json({ message: "Email already exists!", status: 409 });
    } else if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Password and confirm password do not match!",
        status: 400,
      });
    } else {
      const user = new User({
        fullName,
        email,
        phoneNumber,
        password,
        confirmPassword,
      });
      await user.save();
      res
        .status(200)
        .json({ message: "Registration successful!", status: 200 });
    }
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

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const response = await User.findOne({ email });
    if (!response) {
      res.status(404).json({ message: "User does not exist!", status: 404 });
    } else {
      const isMatch = await bcrypt.compare(password, response.password);
      if (isMatch) {
        const token = await response.generateAuthToken();
        res.status(200).json({
          message: "Sign-in successful!",
          status: 200,
          token: token,
        });
      } else {
        res.status(401).json({ message: "Invalid credentials!", status: 401 });
      }
    }
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong with the server!",
      status: 500,
    });
  }
});

module.exports = router;
