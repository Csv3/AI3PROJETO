import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Rotas
import authRoutes from "./routes/auth.js";
import testeRoutes from "./routes/teste.js";
import avaliacoesRouter from "./routes/avaliacoes.js";

// Swagger
import { swaggerUi, swaggerSpec } from "./swagger/swagger.js";

// Base de dados
import { connectDB } from "./config/db.js";

// Variáveis ambiente
dotenv.config();

// Criar app
const app = express();

// Middlewares globais
app.use(express.json());
app.use(cors());

// Rotas
app.use("/auth", authRoutes);
app.use("/teste", testeRoutes);
app.use("/recursos/:id/avaliacoes", avaliacoesRouter);

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rota teste
app.get("/", (req, res) => {
  res.json({ message: "API do Projeto a funcionar!" });
});

// Conectar ao MongoDB
connectDB();

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor a correr na porta ${PORT}`));

// Middleware de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Erro interno do servidor" });
});
