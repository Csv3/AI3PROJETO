import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.js";
import recursosRoutes from "./routes/recursos.js";
import usersRoutes from "./routes/users.js";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//HELMET
const app = express();
app.use(helmet({
  contentSecurityPolicy: false
}));
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// LIMITADOR DE PEDIDOS POR IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100
});
app.use(limiter);

// Swagger
try {
  const swaggerDoc = YAML.load(path.join(__dirname, "../openapi.yaml"));
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));
} catch (err) {
  console.log("No OpenAPI file loaded:", err.message);
}

// Routes
app.use("/auth", authRoutes);
app.use("/recursos", recursosRoutes);
app.use("/users", usersRoutes);

app.get("/", (req, res) => res.json({ status: "ok" }));

//configurações de porta e base de dados mongo
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || process.env.DATABASE_URL || "";

async function start() {
  try {
    if (MONGO_URI) {
      await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
      console.log("Connected to MongoDB");
    } else {
      console.warn("MONGO_URI not set, skipping DB connection for now.");
    }
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server listening on http://0.0.0.0:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start:", err);
    process.exit(1);
  }
}
start();
export default app;
