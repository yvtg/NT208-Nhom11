import express from 'express';
import { sendMessage } from '../controllers/chatbotController.js';

const router = express.Router();

/**
 * @swagger
 * /api/chatbot:
 *   post:
 *     summary: Gửi tin nhắn đến chatbot AI
 *     tags: [Chatbot]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *                 description: Nội dung tin nhắn gửi đến chatbot
 *     responses:
 *       200:
 *         description: Trả về phản hồi từ chatbot
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 response:
 *                   type: string
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       502:
 *         description: Lỗi kết nối với Together AI API
 */
router.post('/', sendMessage);

export default router; 