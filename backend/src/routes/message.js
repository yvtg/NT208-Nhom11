const express = require("express");
const { getMessages } = require("../controllers/messageController");
const verifyToken = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/:conversation_id", verifyToken, getMessages);

module.exports = router;
