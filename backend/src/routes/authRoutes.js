import express from 'express';
import { login , signup } from '../controllers/authController.js';
import { middlewareToken } from '../config/jwt.js'
const authRoutes = express.Router();

authRoutes.post('/login', login);
authRoutes.post('/signup', signup);
authRoutes.get('/verify-token', middlewareToken, (req, res) => {
    res.status(200).json({ valid: true });
});

export default authRoutes;