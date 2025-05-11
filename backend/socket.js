import { Server } from "socket.io";
import database from "./src/config/database.js";
import dotenv from 'dotenv';
import jwt from "jsonwebtoken";

dotenv.config();

const FRONTEND_PORT=process.env.FRONTEND_PORT;
const SECRET_KEY=process.env.SECRET_KEY;

const setupSocket = (server) => {

    // tạo socket server
    const io = new Server(server, {
        cors: {
            origin: `http://localhost:${FRONTEND_PORT}`, 
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    // lấy userId từ token
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;

        if (!token) {
            return next(new Error("Authentication error"));
        }

        try {
            const decoded = jwt.verify(token, SECRET_KEY); 
            socket.userId = decoded.userid; 
            next(); 
        } catch (err) {
            console.error("JWT verify failed:", err);
            return next(new Error("Invalid token"));
        }
    });


    // kết nối với client
    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);

        // Lắng nghe sự kiện gửi tin nhắn
        socket.on("sendMessage", async ({ conversationID, content }) => {
            const senderID = socket.userId;
            console.log("Data from client:", { conversationID, senderID, content });
            try {
                // Lưu tin nhắn vào database (tham khảo sendMessage trong messageController.js)
                const [result] = await database.query(
                    `INSERT INTO Messages (ConversationID, SenderID, Content, CreatedAt) VALUES (?, ?, ?, NOW())`,
                    [conversationID, senderID, content]
                );

                const newMessage = {
                    id: result.insertId,
                    conversationID,
                    senderID: socket.userId, 
                    content,
                    createdAt: new Date(),
                };

                // Phát tin nhắn đến tất cả các client trong cuộc hội thoại
                socket.to(conversationID).emit("receiveMessage", newMessage);
            } catch (error) {
                console.error("Error saving message:", error);
            }
        });

        // Tham gia vào cuộc hội thoại
        socket.on("joinConversation", (conversationID) => {
            socket.join(conversationID);
            console.log(`User ${socket.id} joined conversation ${conversationID}`);
        });

        // Ngắt kết nối
        socket.on("disconnect", () => {
            console.log("A user disconnected:", socket.id);
        });
    });
};


export default setupSocket;