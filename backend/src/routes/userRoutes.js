import express from "express";
import { getUsers, getUserById, getCurrentUser, updateProfile, updatePassword, updateCV } from "../controllers/userController.js";
import { middlewareToken } from '../config/jwt.js';

const userRoutes = express.Router();

/**
 * @swagger
 * /api/users:
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
userRoutes.get("/users", middlewareToken, getUsers);

/**
 * @swagger
 * /api/user/{id}:
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
userRoutes.get("/user/:id", middlewareToken, getUserById);

/**
 * @swagger
 * /api/profile:
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
userRoutes.get("/profile", middlewareToken, getCurrentUser);

/**
 * @swagger
 * /api/profile:
 *   put:
 *     summary: Cập nhật thông tin người dùng
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               avatarurl:
 *                 type: string
 *                 format: url
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phonenumber:
 *                 type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cập nhật thông tin người dùng thành công
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy thông tin người dùng
 */
userRoutes.put("/profile", middlewareToken, updateProfile);

/**
 * @swagger
 * /api/profile/password:
 *   put:
 *     summary: Cập nhật mật khẩu người dùng
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cập nhật mật khẩu người dùng thành công
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy thông tin người dùng
 *       400:
 *         description: Mật khẩu mới và xác nhận mật khẩu không khớp
 */
userRoutes.put("/profile/password", middlewareToken, updatePassword);

/**
 * @swagger
 * /api/profile/cv:
 *   put:
 *     summary: Cập nhật cv người dùng
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               personal_website:
 *                 type: string
 *               cv_url:
 *                 type: string
 *               field_id:
 *                 type: integer
 *               skills:
 *                 type: string
 *               introduce:
 *                 type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cập nhật cv người dùng thành công
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy thông tin người dùng
 */
userRoutes.put("/profile/cv", middlewareToken, updateCV);

export default userRoutes;
