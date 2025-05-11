import express from "express";
import { getUser, getUserById } from "../controllers/userController.js";

const userRoutes = express.Router();
userRoutes.get("/getUser", getUser);
userRoutes.get("/getUserByID/:id", getUserById);
export default userRoutes;
