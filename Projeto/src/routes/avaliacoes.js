import express from "express";
import { criarAvaliacao, listarAvaliacoes } from "../controllers/avaliacoesController.js";
//import { authMiddleware } from "../middleware/auth.js";
import express from "express";
import {
  criarAvaliacao,
  listarAvaliacoes,
  editarAvaliacao,
  eliminarAvaliacao
} from "../controllers/avaliacoesController.js";

import { authMiddleware, authorize } from "../middleware/auth.js";

const avaliacoesrouter = express.Router();

// Criar avaliação — precisa estar autenticado
router.post("/", authMiddleware, criarAvaliacao);

// Listar avaliações — pode ser público ou protegido
router.get("/", listarAvaliacoes);

// Editar avaliação — apenas user autenticado
router.put("/:avaliacoesid", authMiddleware, editarAvaliacao);

// Eliminar avaliação — apenas user autenticado
router.delete("/:avaliacoesid", authMiddleware, eliminarAvaliacao);

export default router;