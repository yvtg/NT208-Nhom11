import express from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import projectRoutes from './projectRoutes.js';
const rootRoutes = express.Router();
rootRoutes.use('/auth', authRoutes);
rootRoutes.use('/user', userRoutes);
rootRoutes.use('/project', projectRoutes);
export default rootRoutes;