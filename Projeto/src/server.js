import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Rotas
import authRoutes from "./routes/auth.js";
import testeRoutes from "./routes/teste.js";

// Swagger
import { swaggerUi, swaggerSpec } from "./swagger/swagger.js";

// Base de dados
import { connectDB } from "./config/db.js";

// Carregar variáveis de ambiente
dotenv.config();

// Criar app
const app = express();

// Middlewares globais
app.use(express.json());
app.use(cors());

// Rotas da aplicação
app.use("/auth", authRoutes);
app.use("/recursos/:id/avaliacoes",avaliacoesrouter)

// Swagger (apenas uma vez!)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rota teste simples
app.get("/", (req, res) => {
  res.json({ message: "API do Projeto a funcionar!" });
});

// Conectar ao MongoDB
connectDB();

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor a correr na porta ${PORT}`));

//Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Erro interno do servidor" });
});