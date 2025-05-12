import express from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import projectRoutes from './projectRoutes.js';
import chatRoutes from './chatRoutes.js';

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Các API liên quan đến xác thực người dùng
 *   - name: Users
 *     description: Các API liên quan đến thông tin người dùng
 *   - name: Projects
 *     description: Các API liên quan đến quản lý dự án
 *   - name: Chat
 *     description: Các API liên quan đến tin nhắn và cuộc trò chuyện
 */

const rootRoutes = express.Router();
rootRoutes.use('/auth', authRoutes);
rootRoutes.use('/', userRoutes);
rootRoutes.use('/project', projectRoutes);
rootRoutes.use('/chat', chatRoutes);
export default rootRoutes;