import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import recursosRoutes from "./routes/recursos.js";
import avaliacoesRouter from "./routes/avaliacoes.js";
import authRoutes from "./routes/auth.js";

import { swaggerUi, swaggerSpec } from "./swagger/swagger.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// -----------------------------
// MIDDLEWARES
// -----------------------------
app.use(cors()); // Permite requests do frontend
app.use(express.json()); // Para JSON
app.use("/uploads", express.static("uploads")); // Serve arquivos enviados

// -----------------------------
// ROTAS
// -----------------------------
app.use("/auth", authRoutes);

// ⚠️ Rotas gerais primeiro
app.use("/recursos", recursosRoutes);

// Rotas com parâmetros depois
app.use("/recursos/:id/avaliacoes", avaliacoesRouter);

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rota teste
app.get("/", (req, res) => res.json({ message: "API do Projeto a funcionar!" }));

// -----------------------------
// Middleware de erros
// -----------------------------
app.use((err, req, res, next) => {
  console.error("ERRO GLOBAL:", err.stack);
  res.status(500).json({ error: "Erro interno do servidor" });
});

// -----------------------------
// CONEXÃO COM DB E INÍCIO DO SERVIDOR
// -----------------------------
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
}).catch(err => {
  console.error("Erro ao conectar ao DB:", err);
});
