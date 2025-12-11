import express from "express";
import auth from "../middleware/auth.js";
import { me, updateMe } from "../controllers/usersController.js";
const router = express.Router();
router.get("/me", auth, me);
router.put("/me", auth, updateMe);
export default router;
