const authenticate = require("../middleware/authenticate");
const express = require("express");
const router = express.Router();
const MessageController = require("../controllers/messageController");

router.post("/sendMessage", authenticate, MessageController.sendMessage);

module.exports = router;
