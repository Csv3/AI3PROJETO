// POST /recursos/register
export const registerResource = async (req, res) => {
  try {
    const { nome_utilizador, nome_recurso, tipo_recurso } = req.body;

    // Verificar se todos os campos foram enviados
    if (!nome_utilizador || !nome_recurso || !tipo_recurso) {
      return res.status(400).json({ error: "Dados incompletos" });
    }

    // Verificar se já existe um recurso com o mesmo nome para o mesmo utilizador
    const recursoExiste = await Resource.findOne({
      nome_recurso,
      nome_utilizador
    });

    if (recursoExiste) {
      return res.status(400).json({ error: "Recurso já registado por este utilizador" });
    }

    // Criar novo recurso
    const novoRecurso = await Resource.create({
      nome_utilizador,
      nome_recurso,
      tipo_recurso
    });

    return res.status(201).json({
      message: "Recurso criado com sucesso",
      resourceId: novoRecurso._id
    });

  } catch (err) {
    console.error("Erro ao criar recurso:", err);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};
