import express from 'express';
import { forgotPassword, login , resetPassword, signup } from '../controllers/authController.js';
import { middlewareToken } from '../config/jwt.js'
import passport from '../config/passport.js';
import { createAccessToken } from '../config/jwt.js';

const authRoutes = express.Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Đăng nhập 
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: 
 *                 format: username
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Đăng nhập thành công, trả về token
 *       401:
 *         description: Thông tin đăng nhập không chính xác
 */
authRoutes.post('/login', login);

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Đăng ký tài khoản mới
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - confirmPassword
 *               - email
 *               - phone
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tạo tài khoản thành công
 *       400:
 *         description: Lỗi dữ liệu
 */
authRoutes.post('/signup', signup);

/**
 * @swagger
 * /api/auth/verify-token:
 *   get:
 *     summary: Xác thực token
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token hợp lệ
 *       401:
 *         description: Token không hợp lệ hoặc đã hết hạn
 */
authRoutes.get('/verify-token', middlewareToken, (req, res) => {
    res.status(200).json({ valid: true });
});

/**
 * @swagger
 * /api/auth/google:
 *   get:
 *     summary: Đăng nhập bằng Google
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Chuyển hướng đến trang đăng nhập Google
 */
authRoutes.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

/**
 * @swagger
 * /api/auth/google/callback:
 *   get:
 *     summary: Callback URL cho đăng nhập Google
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Chuyển hướng đến trang chủ sau khi đăng nhập thành công
 */
authRoutes.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        const payload = {
            userid: req.user.userid,
            username: req.user.username,
            role: req.user.role
        };
        const token = createAccessToken(payload);
        res.redirect(`http://localhost:3001/login?token=${token}`);
    }
);

/**
 * @swagger
 * /api/auth/facebook:
 *   get:
 *     summary: Đăng nhập bằng Facebook
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Chuyển hướng đến trang đăng nhập Facebook
 */
authRoutes.get('/facebook',
    passport.authenticate('facebook', { scope: ['email'] })
);

/**
 * @swagger
 * /api/auth/facebook/callback:
 *   get:
 *     summary: Callback URL cho đăng nhập Facebook
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Chuyển hướng đến trang chủ sau khi đăng nhập thành công
 */
authRoutes.get('/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    (req, res) => {
        const payload = {
            userid: req.user.userid,
            username: req.user.username,
            role: req.user.role
        };
        const token = createAccessToken(payload);
        res.redirect(`http://localhost:3001/login?token=${token}`);
    }
);

/**
 * @swagger
 * /api/auth/github:
 *   get:
 *     summary: Đăng nhập bằng GitHub
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Chuyển hướng đến trang đăng nhập GitHub
 */
authRoutes.get('/github',
    passport.authenticate('github', { scope: ['user:email'] })
);

/**
 * @swagger
 * /api/auth/github/callback:
 *   get:
 *     summary: Callback URL cho đăng nhập GitHub
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Chuyển hướng đến trang chủ sau khi đăng nhập thành công
 */
authRoutes.get('/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    (req, res) => {
        const payload = {
            userid: req.user.userid,
            username: req.user.username,
            role: req.user.role
        };
        const token = createAccessToken(payload);
        res.redirect(`http://localhost:3001/login?token=${token}`);
    }
);

authRoutes.post('/forgot-password', forgotPassword);

/**
 * @swagger
 * /api/auth/reset-password/{token}:
 *   get:
 *     summary: Xác thực token reset password
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Token hợp lệ
 *       400:
 *         description: Token không hợp lệ hoặc đã hết hạn
 */
authRoutes.post('/reset-password', resetPassword);

export default authRoutes;