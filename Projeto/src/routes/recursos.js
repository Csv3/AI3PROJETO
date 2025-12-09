import express from "express";
import * as recursosCtrl from "../controllers/recursosController.js";
import { authMiddleware } from "../middleware/auth.js";
import { sanitize, ownerOnly, checkCaptcha } from "../middleware/security.js";

const router = express.Router();

// listar / ver detalhes = público
router.get("/", recursosCtrl.list);
router.get("/:id", recursosCtrl.getById);

// criar recurso -> autenticação + sanitize (+ opcional captcha)
router.post("/", authMiddleware, sanitize, recursosCtrl.create);

// editar recurso -> autenticação + ownerOnly + sanitize
router.put("/:id", authMiddleware, ownerOnly("recurso"), sanitize, recursosCtrl.update);

// apagar recurso -> autenticação + ownerOnly
router.delete("/:id", authMiddleware, ownerOnly("recurso"), recursosCtrl.remove);

export default router;
