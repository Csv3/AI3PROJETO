import express from "express";
import * as avaliacoesCtrl from "../controllers/avaliacoesController.js";
import { authMiddleware } from "../middleware/auth.js";
import { sanitize, ownerOnly, checkCaptcha } from "../middleware/security.js";

const router = express.Router({ mergeParams: true });

// LISTAR avaliações do recurso (público)
router.get("/", avaliacoesCtrl.listarAvaliacoes);

// CRIAR avaliação (auth + sanitize + captcha)
router.post("/", authMiddleware, checkCaptcha, sanitize, avaliacoesCtrl.criarAvaliacao);

// EDITAR avaliação (auth + ownerOnly)
router.put(
  "/:id",
  authMiddleware,
  ownerOnly("avaliacao"),
  sanitize,
  avaliacoesCtrl.editarAvaliacao
);

// APAGAR avaliação (auth + ownerOnly)
router.delete(
  "/:id",
  authMiddleware,
  ownerOnly("avaliacao"),
  avaliacoesCtrl.eliminarAvaliacao
);

export default router;
