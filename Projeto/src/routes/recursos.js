import express from "express";
import * as recursosCtrl from "../controllers/recursosController.js";
import { authMiddleware } from "../middleware/auth.js";
import { sanitize, ownerOnly } from "../middleware/security.js"; // Mantenho ownerOnly para referência

const router = express.Router();

// LISTAR (GET /): Decidiu-se manter pública, mas pode protegê-la se quiser.
router.get("/", recursosCtrl.list); 
router.get("/:id", recursosCtrl.getById); // Se existir

// CRIAR (POST /): DEVE SER PROTEGIDA
router.post("/", authMiddleware, sanitize, recursosCtrl.create);

// EDITAR (PUT /:id): DEVE SER PROTEGIDA
router.put("/:id", authMiddleware, ownerOnly("resource"), sanitize, recursosCtrl.update); 

// APAGAR (DELETE /:id): DEVE SER PROTEGIDA
router.delete("/:id", authMiddleware, ownerOnly("resource"), recursosCtrl.remove); 

export default router;