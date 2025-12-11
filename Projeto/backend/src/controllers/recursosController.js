import Resource from "../models/resource.js";
import { sanitizeInput } from "../utils/sanitize.js";

export const list = async (req, res) => {
  try {
    const q = {};
    if (req.query.tipo) q.tipo = sanitizeInput(req.query.tipo);
    if (req.query.categoria) q.categoria = sanitizeInput(req.query.categoria);
    const recursos = await Resource.find(q).populate("owner", "nome email");
    return res.json(recursos);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const r = await Resource.findById(id).populate("owner", "nome email");
    if (!r) return res.status(404).json({ error: "Not found" });
    return res.json(r);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const create = async (req, res) => {
  try {
    const body = sanitizeInput(req.body);
    const resource = await Resource.create({ ...body, owner: req.user?.id });
    return res.status(201).json(resource);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const body = sanitizeInput(req.body);
    const updated = await Resource.findOneAndUpdate({ _id: id, owner: req.user?.id }, body, { new: true });
    if (!updated) return res.status(403).json({ error: "Forbidden or not found" });
    return res.json(updated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Resource.findOneAndDelete({ _id: id, owner: req.user?.id });
    if (!deleted) return res.status(403).json({ error: "Forbidden or not found" });
    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file" });
    const r = await Resource.create({ titulo: req.file.originalname, arquivo: req.file.filename, owner: req.user?.id, descricao: "", categoria: "upload" });
    return res.status(201).json(r);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

// Avaliacoes & Comentarios
export const listAvaliacoes = async (req, res) => {
  try {
    const { id } = req.params;
    const r = await Resource.findById(id).select("avaliacoes");
    if (!r) return res.status(404).json({ error: "Not found" });
    return res.json(r.avaliacoes);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const createAvaliacao = async (req, res) => {
  try {
    const { id } = req.params;
    const body = sanitizeInput(req.body);
    const r = await Resource.findById(id);
    if (!r) return res.status(404).json({ error: "Not found" });
    r.avaliacoes.push({ user: req.user?.id, estrelas: body.estrelas, comentario: body.comentario || "" });
    await r.save();
    return res.status(201).json(r.avaliacoes[r.avaliacoes.length-1]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const updateAvaliacao = async (req, res) => {
  try {
    const { id, avaliacaoId } = req.params;
    const body = sanitizeInput(req.body);
    const r = await Resource.findById(id);
    if (!r) return res.status(404).json({ error: "Not found" });
    const a = r.avaliacoes.id(avaliacaoId);
    if (!a) return res.status(404).json({ error: "Not found" });
    if (a.user.toString() !== req.user?.id) return res.status(403).json({ error: "Forbidden" });
    a.estrelas = body.estrelas ?? a.estrelas;
    a.comentario = body.comentario ?? a.comentario;
    await r.save();
    return res.json(a);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const deleteAvaliacao = async (req, res) => {
  try {
    const { id, avaliacaoId } = req.params;
    const r = await Resource.findById(id);
    if (!r) return res.status(404).json({ error: "Not found" });
    const a = r.avaliacoes.id(avaliacaoId);
    if (!a) return res.status(404).json({ error: "Not found" });
    if (a.user.toString() !== req.user?.id) return res.status(403).json({ error: "Forbidden" });
    a.remove();
    await r.save();
    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const listComentarios = async (req, res) => {
  try {
    const { id } = req.params;
    const r = await Resource.findById(id).select("comentarios");
    if (!r) return res.status(404).json({ error: "Not found" });
    return res.json(r.comentarios);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const createComentario = async (req, res) => {
  try {
    const { id } = req.params;
    const body = sanitizeInput(req.body);
    const r = await Resource.findById(id);
    if (!r) return res.status(404).json({ error: "Not found" });
    r.comentarios.push({ user: req.user?.id, comentario: body.comentario, createdAt: new Date() });
    await r.save();
    return res.status(201).json(r.comentarios[r.comentarios.length-1]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const updateComentario = async (req, res) => {
  try {
    const { id, comentarioId } = req.params;
    const body = sanitizeInput(req.body);
    const r = await Resource.findById(id);
    if (!r) return res.status(404).json({ error: "Not found" });
    const c = r.comentarios.id(comentarioId);
    if (!c) return res.status(404).json({ error: "Not found" });
    if (c.user.toString() !== req.user?.id) return res.status(403).json({ error: "Forbidden" });
    c.comentario = body.comentario ?? c.comentario;
    await r.save();
    return res.json(c);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const deleteComentario = async (req, res) => {
  try {
    const { id, comentarioId } = req.params;
    const r = await Resource.findById(id);
    if (!r) return res.status(404).json({ error: "Not found" });
    const c = r.comentarios.id(comentarioId);
    if (!c) return res.status(404).json({ error: "Not found" });
    if (c.user.toString() !== req.user?.id) return res.status(403).json({ error: "Forbidden" });
    c.remove();
    await r.save();
    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};
