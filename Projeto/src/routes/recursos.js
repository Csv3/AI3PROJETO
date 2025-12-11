import express from "express";
import multer from "multer";
import { list, create, update, remove, uploadFile } from "../controllers/recursosController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// -----------------------------
// MULTER - Configuração Upload
// -----------------------------
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

// -----------------------------
// ROTAS
// -----------------------------

// GET /recursos
router.get("/", authMiddleware, list);

// POST /recursos (JSON)
router.post("/", authMiddleware, create);

// POST /recursos/upload (FormData + Ficheiro)
router.post("/upload", authMiddleware, upload.single("ficheiro"), uploadFile);

// PUT /recursos/:id
router.put("/:id", authMiddleware, update);

// DELETE /recursos/:id
router.delete("/:id", authMiddleware, remove);

export default router;
