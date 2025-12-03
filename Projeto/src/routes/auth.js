import express from "express";
import { register, login } from "../controllers/authController.js";
import { authMiddleware, authorize } from "../middleware/auth.js";
const router = express.Router();

/** Registo */
router.post("/register", register);

/** Login */
router.post("/login", login);

export default router;
