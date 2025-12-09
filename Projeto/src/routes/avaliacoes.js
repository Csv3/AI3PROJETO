import express from "express";
import * as avaliacoesCtrl from "../controllers/avaliacoesController.js";
import { authMiddleware } from "../middleware/auth.js";
import { sanitize, ownerOnly, checkCaptcha } from "../middleware/security.js";

const router = express.Router({ mergeParams: true });

// listar avaliações do recurso (público)
router.get("/", avaliacoesCtrl.list);

// criar avaliação (auth + sanitize + captcha)
router.post("/", authMiddleware, checkCaptcha, sanitize, avaliacoesCtrl.create);

// editar avaliação (auth + ownerOnly)
router.put("/:avaliacaoId", authMiddleware, ownerOnly("avaliacao"), sanitize, avaliacoesCtrl.update);

// apagar avaliação (auth + ownerOnly)
router.delete("/:avaliacaoId", authMiddleware, ownerOnly("avaliacao"), avaliacoesCtrl.remove);

export default router;
