import jwt from "jsonwebtoken";
import database from "./database.js";
import dotenv from 'dotenv';

dotenv.config();
const SECRET_KEY=process.env.SECRET_KEY;
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || "3h";

const createAccessToken = (payload) => {
  return jwt.sign({ userid: payload.userid, username: payload.username, role: payload.role }, SECRET_KEY, {
    algorithm: "HS256",
    expiresIn: EXPIRES_IN, // h: hour, m: minutes, s: seconds, d: days
  });
};

const verifyAccessToken = (accessToken) => {
  try {
    return jwt.verify(accessToken, SECRET_KEY);
  } catch (error) {
    return false;
  }
};

const middlewareToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token is missing" });
    }

    const checkToken = verifyAccessToken(token);
    if (!checkToken) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const userId = checkToken.userid;

    // Lấy user info từ DB
    const result = await database.query(
      "SELECT userid, username, role FROM users WHERE userid = $1",
      [userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = result.rows[0];  // { userid, username, role }

    next();
  } catch (error) {
    console.error("Middleware error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export { createAccessToken, verifyAccessToken, middlewareToken };
