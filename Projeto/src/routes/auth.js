// src/routes/authRoutes.js (ou o nome do seu arquivo)

import express from "express";
import { register, login } from "../controllers/authController.js";
// import { sanitize, checkCaptcha } from "../middleware/security.js"; // ⬅️ COMENTE OU REMOVA ESTA LINHA

const router = express.Router();

// ❗ DEFINA O MIDDLEWARE DE SEGURANÇA (SANITIZE) COMO FUNÇÕES VAZIAS ❗
// Isso impede que o código chame funções que não existem ou que falham
const sanitize = (req, res, next) => next(); 
const checkCaptcha = (req, res, next) => next();

// Removidas as funções de segurança das rotas
router.post("/register", register);
router.post("/login", login);

export default router;