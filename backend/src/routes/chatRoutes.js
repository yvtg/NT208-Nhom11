import express from 'express';
import { getMessages, sendMessage } from '../controllers/messageController.js';
import { middlewareToken } from '../config/jwt.js';
import { createConversation, deleteConversation, getConversationsWithLatestMessages } from '../controllers/chatController.js';

const chatRoutes = express.Router();

// Conversation routes
chatRoutes.get("/conversations", middlewareToken, getConversationsWithLatestMessages);
chatRoutes.post("/conversations", middlewareToken, createConversation);
chatRoutes.delete("/conversations/:conversationID", middlewareToken, deleteConversation)


// Message routes
chatRoutes.get("/messages/:conversationID", middlewareToken, getMessages);
chatRoutes.post("/messages", middlewareToken, sendMessage);

export default chatRoutes;
