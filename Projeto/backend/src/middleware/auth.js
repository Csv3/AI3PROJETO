import { verifyToken } from "../utils/jwt.js";

//ROTAS PROTEGIDAS QUE VALIDA TOKEN ANTES DE PERMITIR ACESSO
export default function auth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Token missing" });
  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}
