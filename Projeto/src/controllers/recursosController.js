import Resource from "../models/Resource.js";

// GET /recursos
export const list = async (req, res) => {
    try {
        const recursos = await Resource.find({});
        res.status(200).json(recursos);
    } catch (err) {
        console.error("Erro ao listar recursos:", err);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};

// POST /recursos/upload
export const uploadFile = async (req, res) => {
    try {
        const { nome_recurso, tipo_recurso, nome_utilizador } = req.body;

        if (!req.file) {
            return res.status(400).json({ error: "Ficheiro não enviado." });
        }

        const novoRecurso = await Resource.create({
            nome_recurso,
            tipo_recurso,
            nome_utilizador,
            caminho_ficheiro: req.file.path
        });

        res.status(201).json({
            message: "Upload efetuado com sucesso",
            resource: novoRecurso,
            resourceId: novoRecurso._id
        });

    } catch (err) {
        console.error("Erro no upload:", err.message);
        res.status(500).json({ error: err.message });
    }
};

// POST /recursos
export const create = async (req, res) => {
    try {
        const { nome_recurso, tipo_recurso, nome_utilizador } = req.body;

        if (!nome_recurso || !tipo_recurso || !nome_utilizador) {
            return res.status(400).json({
                error: "Campos obrigatórios: nome_recurso, tipo_recurso, nome_utilizador"
            });
        }

        const novoRecurso = await Resource.create({
            nome_recurso,
            tipo_recurso,
            nome_utilizador
        });

        res.status(201).json({
            message: "Recurso criado com sucesso",
            resource: novoRecurso,
            resourceId: novoRecurso._id
        });
    } catch (err) {
        console.error("Erro ao criar recurso:", err.message);
        res.status(500).json({ error: err.message });
    }
};

// PUT /recursos/:id
export const update = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome_recurso, tipo_recurso, nome_utilizador } = req.body;

        const atualizado = await Resource.findByIdAndUpdate(
            id,
            { nome_recurso, tipo_recurso, nome_utilizador },
            { new: true, runValidators: true }
        );

        if (!atualizado) {
            return res.status(404).json({ error: "Recurso não encontrado." });
        }

        res.status(200).json({ message: "Atualizado", resource: atualizado });
    } catch (err) {
        console.error("Erro ao atualizar:", err.message);
        res.status(500).json({ error: err.message });
    }
};

// DELETE /recursos/:id
export const remove = async (req, res) => {
    try {
        const { id } = req.params;

        const apagado = await Resource.findByIdAndDelete(id);

        if (!apagado) {
            return res.status(404).json({ error: "Recurso não encontrado." });
        }

        res.status(204).send();
    } catch (err) {
        console.error("Erro ao apagar:", err.message);
        res.status(500).json({ error: err.message });
    }
};
