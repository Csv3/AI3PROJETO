import express from "express";
import * as comentariosCtrl from "../controllers/comentariosController.js";
import { authMiddleware } from "../middleware/auth.js";
import { sanitize, ownerOnly, checkCaptcha } from "../middleware/security.js";

const router = express.Router({ mergeParams: true });

// criar comentário -> auth + captcha + sanitize
router.post("/:id/comentarios", authMiddleware, checkCaptcha, sanitize, comentariosCtrl.create);

// editar comentário -> auth + ownerOnly
router.put("/:id/comentarios/:comentarioId", authMiddleware, ownerOnly("comentario"), sanitize, comentariosCtrl.update);

// apagar comentário -> auth + ownerOnly
router.delete("/:id/comentarios/:comentarioId", authMiddleware, ownerOnly("comentario"), comentariosCtrl.remove);

export default router;
