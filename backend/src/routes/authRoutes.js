import express from 'express';
import { register } from '../controllers/authController.js';

const router = express.Router();

// Định nghĩa API đăng ký user
router.post('/register', register);

export default router;
