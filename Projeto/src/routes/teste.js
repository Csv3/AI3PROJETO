import express from "express";
import mongoose from "mongoose";

const router = express.Router();

router.get("/inserir", async (req, res) => {
  try {
    const Teste = mongoose.model("Teste", new mongoose.Schema({ nome: String }));
    await Teste.create({ nome: "Primeiro documento!" });
    res.json({ msg: "Documento criado!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
