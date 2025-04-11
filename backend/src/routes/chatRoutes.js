import express from 'express';
import { getMessages, getLastestMessages, sendMessage } from '../controllers/messageController.js';
import { middlewareToken } from '../config/jwt.js';
import { createConversation, getConversations } from '../controllers/chatController.js';

const chatRoutes = express.Router();

// Conversation routes
chatRoutes.get("/conversations", middlewareToken, getConversations);
chatRoutes.post("/conversations", middlewareToken, createConversation);

// Message routes
chatRoutes.get("/messages/:conversationID", middlewareToken, getMessages);
chatRoutes.post("/messages", middlewareToken, sendMessage);
chatRoutes.get("/messages", middlewareToken, getLastestMessages)

export default chatRoutes;
