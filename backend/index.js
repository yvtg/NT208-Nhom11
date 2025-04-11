import http from "http";
import setupSocket from "./socket.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import database from "./src/config/database.js";

import authRoutes from "./src/routes/authRoutes.js";

import chatRoutes from './src/routes/chatRoutes.js';

dotenv.config();

const app = express();

const server = http.createServer(app);
// Cấu hình socket.io
setupSocket(server);
server.listen(3002, () => {
    console.log("Socket server is running on port 3002");
});

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors({
    origin: "http://localhost:3001", // frontend URL
    credentials: true
    }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

// Kiểm tra kết nối database
database.getConnection()
    .then(() => console.log("✅ Database connected successfully!"))
    .catch((err) => console.error("❌ Database connection failed:", err));

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
