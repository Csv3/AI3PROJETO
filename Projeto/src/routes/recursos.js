import express from "express";
import { registerResource } from "../controllers/recursoController.js";
        //nome da funçao 
const router = express.Router();

router.post("/register", registerResource);
                        //nome da funçao

export default router;
