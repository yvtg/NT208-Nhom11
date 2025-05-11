import jwt from "jsonwebtoken";
import database from "./database.js";
import dotenv from 'dotenv';

dotenv.config();
const SECRET_KEY=process.env.SECRET_KEY;
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || "3h";

const createAccessToken = (payload) => {
  return jwt.sign({ userid: payload.userid }, SECRET_KEY, {
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
      console.log("Invalid token"); // Log invalid token
      return res.status(401).json({ message: "Invalid token" });
    }

    const userId = checkToken.userid;

    const result = await database.query("SELECT * FROM users WHERE userid = $1", [userId]);

    req.userId = userId; // Attach userId to the request
    next();
  } catch (error) {
    console.error("Middleware error:", error); // Log middleware error
    res.status(500).json({ message: "Internal server error" });
  }
};
export { createAccessToken, verifyAccessToken, middlewareToken };
