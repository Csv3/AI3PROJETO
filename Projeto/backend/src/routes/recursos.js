import express from "express";
import auth from "../middleware/auth.js";
import upload from "../middleware/upload.js";
import {
  list, getOne, create, update, remove, uploadFile,
  listAvaliacoes, createAvaliacao, updateAvaliacao, deleteAvaliacao,
  listComentarios, createComentario, updateComentario, deleteComentario
} from "../controllers/recursosController.js";

const router = express.Router();
//RECURSOS
router.get("/", list);
router.post("/", auth, create);
router.get("/pesquisa", list);
router.get("/:id", getOne);
router.put("/:id", auth, update);
router.delete("/:id", auth, remove);
router.post("/upload", auth, upload.single("file"), uploadFile);

// avaliações
router.get("/:id/avaliacoes", listAvaliacoes);
router.post("/:id/avaliacoes", auth, createAvaliacao);
router.put("/:id/avaliacoes/:avaliacaoId", auth, updateAvaliacao);
router.delete("/:id/avaliacoes/:avaliacaoId", auth, deleteAvaliacao);

// comentários
router.get("/:id/comentarios", listComentarios);
router.post("/:id/comentarios", auth, createComentario);
router.put("/:id/comentarios/:comentarioId", auth, updateComentario);
router.delete("/:id/comentarios/:comentarioId", auth, deleteComentario);

export default router;
