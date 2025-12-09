import express from "express";
import { registerResource } from "../controllers/recursosController.js";
//import { authMiddleware, authorize } from "../middleware/auth.js";
        //nome da funçao 
const router = express.Router();

router.post("/", registerResource);
                        //nome da funçao

export default router;
