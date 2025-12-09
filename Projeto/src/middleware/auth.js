import jwt from "jsonwebtoken";

// Middleware: verificar se o token é válido
export const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ error: "Token ausente" });
  }

  const parts = header.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ error: "Formato de token inválido" });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // ex: { id, email }
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
};
//Verificar se o utilizador é o mesmo que está a tentar aceder ou alterar os seus dados
export const sameUser = (req, res, next) => {
  if (req.user.id !== req.params.id && req.user.role !== "autenticado") {
    return res.status(403).json({ error: "Não tens permissão para alterar este perfil" });
  }
  next();
};

// Middleware: verificar permissões (roles)
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Token necessário" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Sem permissões para aceder a este recurso" });
    }

    next();
  };
};
