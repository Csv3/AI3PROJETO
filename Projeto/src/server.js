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

app.use(express.json());
app.use(cors());

// --- ROTAS ---
app.use("/auth", authRoutes);

// ⚠️ PRIMEIRO as rotas gerais
app.use("/recursos", recursosRoutes);

// ⚠️ Depois as rotas com parâmetros
app.use("/recursos/:id/avaliacoes", avaliacoesRouter);

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Teste
app.get("/", (req, res) => {
  res.json({ message: "API do Projeto a funcionar!" });
});

// Conectar BD
connectDB();

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor a correr na porta ${PORT}`));

// Middleware de erros
app.use((err, req, res, next) => {
  console.error("ERRO GLOBAL:", err.stack);
  res.status(500).json({ error: "Erro interno do servidor" });
});

export default app;
