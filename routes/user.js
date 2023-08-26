const authenticate = require("../middleware/authenticate");
const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");

router.get("/checkSignIn", authenticate, UserController.checkSignIn);

router.get("/getUserDetails", authenticate, UserController.getUserDetails);

router.patch("/updateProfile", authenticate, UserController.updateProfile);

module.exports = router;
