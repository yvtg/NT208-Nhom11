import express from 'express';
import { getMessages, sendMessage } from '../controllers/messageController.js';
import { middlewareToken } from '../config/jwt.js';
import { createConversation, deleteConversation, getConversationsWithLatestMessages } from '../controllers/chatController.js';

const chatRoutes = express.Router();

// Conversation routes
/**
 * @swagger
 * /api/chat/conversations:
 *   get:
 *     summary: Lấy danh sách cuộc trò chuyện với tin nhắn mới nhất
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trả về danh sách cuộc trò chuyện thành công
 *       401:
 *         description: Không có quyền truy cập
 */
chatRoutes.get("/conversations", middlewareToken, getConversationsWithLatestMessages);

/**
 * @swagger
 * /api/chat/conversations:
 *   post:
 *     summary: Tạo cuộc trò chuyện mới
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - participantIDs
 *             properties:
 *               participantIDs:
 *                 type: array
 *                 items:
 *                   type: string
 *               title:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tạo cuộc trò chuyện thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập
 */
chatRoutes.post("/conversations", middlewareToken, createConversation);

/**
 * @swagger
 * /api/chat/conversations/{conversationID}:
 *   delete:
 *     summary: Xóa cuộc trò chuyện
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conversationID
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của cuộc trò chuyện
 *     responses:
 *       200:
 *         description: Xóa cuộc trò chuyện thành công
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy cuộc trò chuyện
 */
chatRoutes.delete("/conversations/:conversationID", middlewareToken, deleteConversation)


// Message routes
/**
 * @swagger
 * /api/chat/messages/{conversationID}:
 *   get:
 *     summary: Lấy tin nhắn của cuộc trò chuyện
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conversationID
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của cuộc trò chuyện
 *     responses:
 *       200:
 *         description: Trả về danh sách tin nhắn thành công
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy cuộc trò chuyện
 */
chatRoutes.get("/messages/:conversationID", middlewareToken, getMessages);

/**
 * @swagger
 * /api/chat/messages:
 *   post:
 *     summary: Gửi tin nhắn mới
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - conversationID
 *               - content
 *             properties:
 *               conversationID:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Gửi tin nhắn thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập
 */
chatRoutes.post("/messages", middlewareToken, sendMessage);

export default chatRoutes;
