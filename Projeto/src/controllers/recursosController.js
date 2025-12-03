import Resource from "../models/Resource.js";

// POST para criar um novo recurso (pasta)
export const createResource = async (req, res) => {
  try {
    const { titulo, descricao, tags, itens = [] } = req.body;

    if (!titulo || !descricao || !tags) {
      return res.status(400).json({ error: "Título, descrição e tags são obrigatórios" });
    }

    // Criar o recurso (pasta)
    const newResource = await Resource.create({
      titulo,
      descricao,
      tags,
      itens, // Pode ser uma lista vazia
    });

    res.status(201).json({ message: "Recurso criado", resource: newResource });
  } catch (err) {
    console.error("Erro ao criar recurso:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};


// POST para upload de um único ficheiro
export const uploadFile = async (req, res) => {
  try {
    const { tipo, titulo } = req.body;
    const file = req.file;  // Acessar o ficheiro enviado

    if (!file || !titulo || !tipo) {
      return res.status(400).json({ error: "Ficheiro, título e tipo são obrigatórios" });
    }

    // Criar o recurso (ficheiro) no banco
    const newFile = await Resource.create({
      titulo,
      tipo,
      fileUrl: file.path,  // Guarda o ficheiro na pasta e assim não fica solto/individual
    });

    res.status(201).json({ message: "Ficheiro carregado", file: newFile });

  } catch (err) {
    console.error("Erro ao fazer upload:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};
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
