// src/controllers/recursosController.js
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

// POST /recursos (PROEGIDO)
export const create = async (req, res) => {
    try {
        // Os campos do frontend (Recursos.js)
        const { nome_recurso, tipo_recurso, nome_utilizador } = req.body;
        
        if (!nome_recurso || !tipo_recurso || !nome_utilizador) {
            console.error("ERRO: Dados incompletos para criação de recurso. Body:", req.body);
            return res.status(400).json({ error: "Dados incompletos: nome, tipo e utilizador são obrigatórios." });
        }

        // Tenta criar e salvar no MongoDB
        const novoRecurso = await Resource.create({
            nome_utilizador,
            nome_recurso,
            tipo_recurso
        });
        
        res.status(201).json({ 
            message: "Recurso criado com sucesso", 
            resource: novoRecurso, 
            resourceId: novoRecurso._id 
        });

    } catch (err) {
        // 🚨 PONTO CHAVE: Reporta o erro exato do Mongoose/BD
        console.error("❌ ERRO GRAVE ao salvar recurso no MongoDB (Create):", err.message);
        res.status(500).json({ error: `Erro interno do servidor: ${err.message}` });
    }
};

// PUT /recursos/:id (PROTEGIDO + ownerOnly)
export const update = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome_recurso, tipo_recurso, nome_utilizador } = req.body;
        
        // Assumimos que o middleware de permissão foi executado

        const updatedResource = await Resource.findByIdAndUpdate(
            id,
            { nome_recurso, tipo_recurso, nome_utilizador },
            { new: true, runValidators: true }
        );

        if (!updatedResource) {
            return res.status(404).json({ error: "Recurso não encontrado ou sem permissão." });
        }

        res.status(200).json({ message: "Recurso atualizado", resource: updatedResource });

    } catch (err) {
        console.error("❌ ERRO GRAVE ao salvar recurso no MongoDB (Update):", err.message);
        res.status(500).json({ error: `Erro interno do servidor: ${err.message}` });
    }
};

// DELETE /recursos/:id (PROTEGIDO + ownerOnly)
export const remove = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Assumimos que o middleware de permissão foi executado
        
        const result = await Resource.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).json({ error: "Recurso não encontrado ou sem permissão." });
        }

        res.status(204).send(); 

    } catch (err) {
        console.error("❌ ERRO GRAVE ao apagar recurso no MongoDB:", err.message);
        res.status(500).json({ error: `Erro interno do servidor: ${err.message}` });
    }
};

// Se tiver outras funções (como getById, etc.), adicione-as aqui.