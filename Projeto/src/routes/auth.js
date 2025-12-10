import express from "express";
import { register, login } from "../controllers/authController.js";
import { sanitize, checkCaptcha } from "../middleware/security.js";


const router = express.Router();

router.post("/register", checkCaptcha, sanitize, register); // ou "/registo" conforme o teu router
router.post("/login", checkCaptcha, sanitize, login);

export default router;
