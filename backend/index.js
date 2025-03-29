import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import database from "./config/database.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// Kiểm tra kết nối database
database.getConnection()
    .then(() => console.log("✅ Database connected successfully!"))
    .catch((err) => console.error("❌ Database connection failed:", err));

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
