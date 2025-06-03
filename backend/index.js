import http from "http";
import setupSocket from "./socket.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import session from "express-session";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./src/config/swagger.js";

import passport from "./src/config/passport.js";

import database from "./src/config/database.js";

import rootRoutes from "./src/routes/rootRoutes.js";
import chatbotRoutes from "./src/routes/chatbotRoute.js";
import projectRoutes from "./src/routes/projectRoutes.js";

import { updateExpiredProjects } from './src/config/cronJob.js'

dotenv.config();

const app = express();

const SERVER_PORT = process.env.SERVER_PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3001";
const SOCKET_PORT = process.env.SOCKET_PORT || 3002; 


const server = http.createServer(app);

// Cấu hình socket.io
setupSocket(server);
server.listen(SOCKET_PORT, () => {
    console.log("Socket server is running on port ", SOCKET_PORT);
});

// cấu hình swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// Middleware (được di chuyển xuống dưới các route sử dụng Multer)
// app.use(express.json()); // <-- Moved below routes
app.use(cors({
    origin: `${FRONTEND_URL}`, 
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
app.use("/api", rootRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/project", projectRoutes);

// Middleware xử lý body (đặt sau các route sử dụng Multer)
app.use(express.json());
// Nếu có express.urlencoded() cũng nên đặt ở đây
// app.use(express.urlencoded({ extended: true }));


// Kiểm tra kết nối database
database.connect()
    .then(client => {
        console.log("✅ PostgreSQL database connected successfully!");
        client.release();
    })
    .catch((err) => console.error("❌ Database connection failed:", err));

app.listen(SERVER_PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is running on http://localhost:${SERVER_PORT}`);
});
