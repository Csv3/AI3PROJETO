import express from "express";
import multer from "multer";
import { list, create, update, remove, uploadFile } from "../controllers/recursosController.js";
import { authMiddleware} from "../middleware/auth.js";


const router = express.Router();

// -----------------------------
// MULTER - Configuração Upload
// -----------------------------
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

// -----------------------------
// ROTAS
// -----------------------------
router.get("/", authMiddleware, list);
router.post("/", authMiddleware, create);
router.put("/:id", authMiddleware, update);
router.delete("/:id", authMiddleware, remove);
router.post("/upload", upload.single("file"), uploadFile);
export default router;
