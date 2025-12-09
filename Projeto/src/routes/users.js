import express from "express";
import * as usersCtrl from "../controllers/usersController.js";
import { authMiddleware } from "../middleware/auth.js";
import { sanitize } from "../middleware/security.js";

const router = express.Router();

router.get("/me", authMiddleware, usersCtrl.me);

// se permites PUT /users/:id
router.put("/:id", authMiddleware, sanitize, usersCtrl.update);

// ou se só tens PUT /users/me, deixa como está com authMiddleware + sanitize
export default router;
