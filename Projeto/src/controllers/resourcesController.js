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
