import express from "express";
import { getUsers, getUserById, getCurrentUser } from "../controllers/userController.js";
import { middlewareToken } from '../config/jwt.js';

const userRoutes = express.Router();

/**
 * @swagger
 * /user/getUsers:
 *   get:
 *     summary: Lấy thông tin toàn bộ người dùng có trong database
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trả về thông tin người dùng thành công
 *       401:
 *         description: Không có quyền truy cập
 */
userRoutes.get("/getUsers", getUsers);

/**
 * @swagger
 * /user/getUserByID/{id}:
 *   get:
 *     summary: Lấy thông tin người dùng theo ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của người dùng
 *     responses:
 *       200:
 *         description: Trả về thông tin người dùng thành công
 *       404:
 *         description: Không tìm thấy người dùng
 */
userRoutes.get("/getUserByID/:id", getUserById);

/**
 * @swagger
 * /user/getCurrentUser:
 *   get:
 *     summary: Lấy thông tin người dùng hiện tại
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trả về thông tin người dùng thành công
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy thông tin người dùng
 */
userRoutes.get("/getCurrentUser", middlewareToken, getCurrentUser);


export default userRoutes;
