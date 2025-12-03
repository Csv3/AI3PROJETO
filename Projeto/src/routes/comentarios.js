import express from "express";
import { criarComentario, listarComentarios } from "../controllers/comentariosController.js";
//import { authMiddleware, authorize } from "../middleware/auth.js";


import express from "express";
import {
    criarComentario,
    listarComentarios,
    editarComentario,
    eliminarComentario
} from "../controllers/comentariosController.js";

import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Criar comentário — autenticado
router.post("/criar", authMiddleware, criarComentario);

// Listar comentários por recurso
router.get("/:recursoId", listarComentarios);

// Editar comentário — autenticado
router.put("/:id", authMiddleware, editarComentario);

// Eliminar comentário — autenticado
router.delete("/:id", authMiddleware, eliminarComentario);

export default router;
