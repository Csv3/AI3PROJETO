import Resource from "../models/Resource.js";  // Importa o modelo de recursos (pastas)
import Evaluation from "../models/Evaluation.js";  // Importa o modelo de avaliações

export const avaliar = async (req, res) => {
  try {
    // Desestruturar os dados enviados na requisição
    const { tipo, referenciaId, estrelas } = req.body;

    // Verificar se o tipo é 'resource' (somente pastas)
    if (tipo !== 'resource') {
      return res.status(400).json({ error: "Avaliação apenas permitida para recursos (pastas)" });
    }

    // Verificar se o recurso com o 'referenciaId' existe no banco de dados
    const resource = await Resource.findById(referenciaId);
    
    // Se o recurso não for encontrado, retornar erro
    if (!resource) {
      return res.status(404).json({ error: "Recurso (pasta) não encontrado" });
    }

    // Criar uma nova avaliação
    const newEvaluation = await Evaluation.create({
      tipo,              // O tipo deve ser sempre 'resource' (pasta)
      referenciaId,      // O ID do recurso (pasta)
      estrelas           // A nota de avaliação (1 a 5)
    });

    // Retornar sucesso com a avaliação criada
    res.status(201).json({
      message: "Avaliação criada com sucesso",
      evaluation: newEvaluation
    });

  } catch (err) {
    console.error("Erro ao criar avaliação:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};
