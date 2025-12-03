import Comentario from "../models/comentarios.js";

// Criar comentário
export const criarComentario = async (req, res) => {
  try {
    const comentario = await Comentario.create({
      ...req.body,
      criadoPor: req.user.id,
    });

    res.status(201).json(comentario);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Listar comentários de um recurso
export const listarComentarios = async (req, res) => {
  try {
    const comments = await Comentario.find({ recursoId: req.params.recursoId })
      .populate("criadoPor", "nome email");

    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Editar comentário
export const editarComentario = async (req, res) => {
  try {
    const comentario = await Comentario.findById(req.params.id);

    if (!comentario) return res.status(404).json({ error: "Comentário não encontrado" });

    if (comentario.criadoPor.toString() !== req.user.id) {
      return res.status(403).json({ error: "Não tens permissão para editar este comentário" });
    }

    const updated = await Comentario.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar comentário
export const eliminarComentario = async (req, res) => {
  try {
    const comentario = await Comentario.findById(req.params.id);

    if (!comentario) return res.status(404).json({ error: "Comentário não encontrado" });

    if (comentario.criadoPor.toString() !== req.user.id) {
      return res.status(403).json({ error: "Não tens permissão para eliminar este comentário" });
    }

    await comentario.deleteOne();

    res.json({ message: "Comentário eliminado com sucesso" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

