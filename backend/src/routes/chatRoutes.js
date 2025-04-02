const express = require("express");
const { getConversations, createConversation } = require("../controllers/conversationController");
const verifyToken = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/", verifyToken, getConversations);
router.post("/", verifyToken, createConversation);

module.exports = router;
