import Avaliacao from "../models/avaliacoes.js";

// Criar avaliação
export const criarAvaliacao = async (req, res) => {
  try {
    const avaliacao = await Avaliacao.create({
      ...req.body,
      criadoPor: req.user.id,
    });

    res.status(201).json(avaliacao);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Listar avaliações
export const listarAvaliacoes = async (req, res) => {
  try {
    const avaliacoes = await Avaliacao.find().populate("criadoPor", "nome email");
    res.json(avaliacoes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Editar avaliação
export const editarAvaliacao = async (req, res) => {
  try {
    const avaliacao = await Avaliacao.findById(req.params.id);

    if (!avaliacao) return res.status(404).json({ error: "Avaliação não encontrada" });

    // Verifica se o user é o dono da avaliação
    if (avaliacao.criadoPor.toString() !== req.user.id) {
      return res.status(403).json({ error: "Não tens permissão para editar esta avaliação" });
    }

    const updated = await Avaliacao.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar avaliação
export const eliminarAvaliacao = async (req, res) => {
  try {
    const avaliacao = await Avaliacao.findById(req.params.id);

    if (!avaliacao) return res.status(404).json({ error: "Avaliação não encontrada" });

    if (avaliacao.criadoPor.toString() !== req.user.id) {
      return res.status(403).json({ error: "Não tens permissão para eliminar esta avaliação" });
    }

    await avaliacao.deleteOne();

    res.json({ message: "Avaliação eliminada com sucesso" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
