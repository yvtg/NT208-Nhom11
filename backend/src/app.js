import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

module.exports = app;

