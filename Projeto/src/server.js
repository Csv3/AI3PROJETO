import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Rotas
import authRoutes from "./routes/auth.js";
import avaliacoesRouter from "./routes/avaliacoes.js";

// Swagger
import { swaggerUi, swaggerSpec } from "./swagger/swagger.js";

// Base de dados
import { connectDB } from "./config/db.js";

// Variáveis de ambiente
dotenv.config();

// --- CRIAR APP ---
const app = express();

// Middlewares globais
app.use(express.json());
app.use(cors());

// --- ROTAS ---
app.use("/auth", authRoutes);
app.use("/recursos/:id/avaliacoes", avaliacoesRouter);

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rota teste
app.get("/", (req, res) => {
  res.json({ message: "API do Projeto a funcionar!" });
});

// --- CONECTAR AO MONGO ---
connectDB();

// --- INICIAR SERVIDOR ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor a correr na porta ${PORT}`));

// --- MIDDLEWARE DE ERROS ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Erro interno do servidor" });
});
