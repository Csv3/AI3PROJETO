
 //Ajusta os métodos de acesso ao modelo se necessário (findById / findByPk / query).


import xss from "xss";

// IMPORTA OS MODELOS (ajusta os caminhos se necessário)
import Recursos from "../models/recursos.js";
import Avaliacoes from "../models/avaliacoes.js";
import Comentarios from "../models/comentarios.js";

/* -----------------------------
 * SANITIZE — remover scripts e XSS
 * ----------------------------- */
export const sanitize = (req, res, next) => {
  if (req.body && typeof req.body === "object") {
    Object.keys(req.body).forEach((key) => {
      if (typeof req.body[key] === "string") {
        // Remove XSS, scripts e tags perigosas
        req.body[key] = xss(req.body[key].trim());
      }
    });
  }
  next();
};

/* -----------------------------
 * CAPTCHA — validar token
 * ----------------------------- */
export const checkCaptcha = (req, res, next) => {
  const token = req.headers["x-captcha-token"] || req.body?.captchaToken;

  if (!token) {
    return res.status(400).json({ error: "CAPTCHA em falta" });
  }

  // TODO: aqui validação real com o provider (Google reCAPTCHA, hCaptcha, Cloudflare Turnstile...)

  // Para já, aceitamos qualquer token não vazio (dev/test)
  next();
};

/* -----------------------------
 * OWNER ONLY — validar dono do recurso
 * tipo: "recurso" | "avaliacao" | "comentario"
 * ----------------------------- */
export const ownerOnly = (tipo) => {
  return async (req, res, next) => {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: "Token necessário" });

      // id do recurso/avaliacao/comentario na rota — tenta params.avaliacaoId ou params.comentarioId ou params.id
      const paramId = req.params.avaliacaoId || req.params.comentarioId || req.params.id;
      if (!paramId) return res.status(400).json({ error: "ID em falta na rota" });

      let item = null;

      if (tipo === "recurso") {
        // tenta diferentes métodos de acordo com o ORM/DB
        if (typeof Recursos.findById === "function") {
          item = await Recursos.findById(paramId);
        } else if (typeof Recursos.findByPk === "function") {
          item = await Recursos.findByPk(paramId);
        } else {
          // fallback: procura por id manualmente (assume uma função "find")
          if (typeof Recursos.find === "function") {
            item = await Recursos.find({ id: paramId });
            if (Array.isArray(item)) item = item[0];
          }
        }
      }

      if (tipo === "avaliacao") {
        if (typeof Avaliacoes.findById === "function") {
          item = await Avaliacoes.findById(paramId);
        } else if (typeof Avaliacoes.findByPk === "function") {
          item = await Avaliacoes.findByPk(paramId);
        } else if (typeof Avaliacoes.find === "function") {
          item = await Avaliacoes.find({ id: paramId });
          if (Array.isArray(item)) item = item[0];
        }
      }

      if (tipo === "comentario") {
        if (typeof Comentarios.findById === "function") {
          item = await Comentarios.findById(paramId);
        } else if (typeof Comentarios.findByPk === "function") {
          item = await Comentarios.findByPk(paramId);
        } else if (typeof Comentarios.find === "function") {
          item = await Comentarios.find({ id: paramId });
          if (Array.isArray(item)) item = item[0];
        }
      }

      if (!item) {
        return res.status(404).json({ error: `${tipo} não encontrado` });
      }

      // Normaliza a propriedade do autor do item
      // Ajusta "userId" para o campo que o teu modelo usa (ex: authorId, user_id, createdBy)
      const ownerFieldCandidates = ["userId", "user_id", "authorId", "author_id", "createdBy", "ownerId"];
      let owner = null;
      for (const k of ownerFieldCandidates) {
        if (Object.prototype.hasOwnProperty.call(item, k) && item[k] != null) {
          owner = item[k];
          break;
        }
        // também tenta item.dataValues se for Sequelize
        if (item.dataValues && Object.prototype.hasOwnProperty.call(item.dataValues, k) && item.dataValues[k] != null) {
          owner = item.dataValues[k];
          break;
        }
      }

      if (owner == null && item.user) owner = item.user; // fallback

      if (owner == null) {
        // Não conseguimos determinar dono; falha seguro
        return res.status(403).json({ error: "Impossível verificar autor do item" });
      }

      if (owner.toString() !== userId.toString()) {
        return res.status(403).json({ error: "Acesso proibido — não és o dono deste recurso" });
      }

      // tudo ok
      next();
    } catch (err) {
      console.error("ownerOnly error:", err);
      return res.status(500).json({ error: "Erro interno no ownerOnly" });
    }
  };
};
