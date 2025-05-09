import http from "http";
import setupSocket from "./socket.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "./src/config/passport.js";

import database from "./src/config/database.js";

import authRoutes from "./src/routes/authRoutes.js";

import chatRoutes from './src/routes/chatRoutes.js';
import rootRoutes from "./src/routes/rootRoutes.js";

dotenv.config();

const app = express();

const SERVER_PORT = process.env.SERVER_PORT || 3000;
const FRONTEND_PORT = process.env.FRONTEND_PORT || 3001;
const SOCKET_PORT = process.env.SOCKET_PORT || 3002; 


const server = http.createServer(app);

// Cấu hình socket.io
setupSocket(server);
server.listen(SOCKET_PORT, () => {
    console.log("Socket server is running on port ", SOCKET_PORT);
});


// Middleware
app.use(express.json());
app.use(cors({
    origin: `http://localhost:${FRONTEND_PORT}`, 
    credentials: true
    }));
app.use(cookieParser());
app.use(session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use(rootRoutes);
// Kiểm tra kết nối database
database.getConnection()
    .then(() => console.log("✅ Database connected successfully!"))
    .catch((err) => console.error("❌ Database connection failed:", err));

app.listen(SERVER_PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is running on http://localhost:${SERVER_PORT}`);
});
