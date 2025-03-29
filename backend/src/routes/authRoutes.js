import express from 'express';
import { login } from '../controllers/authController.js';
const authRoutes = express.Router();

authRoutes.post('/login', login);
authRoutes.post('/signup', signup);

export default authRoutes;