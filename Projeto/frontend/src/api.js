const API_URL = "http://localhost:5000";

// Função auxiliar para tratar respostas do backend
async function safeJsonFetch(res) {
    const text = await res.text(); // pega a resposta bruta
    try {
        return JSON.parse(text); // tenta converter para JSON
    } catch (err) {
        console.error("Resposta do backend não é JSON:", text);
        throw new Error("Resposta inválida do backend");
    }
}

export const api = {
    // ---------------------- AUTENTICAÇÃO
    login: async (email, password) => {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        return safeJsonFetch(res);
    },

    REGISTER: async (name, email, password) => {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password })
        });
        return safeJsonFetch(res);
    },

    // ---------------------- RECURSOS
    listarRecursos: async () => {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/recursos`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) {
            console.error("Erro ao carregar recursos: ", res.status);
            throw new Error("Failed to fetch");
        }

        return safeJsonFetch(res);
    },

    criarRecurso: async (payload) => {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/recursos`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        return safeJsonFetch(res);
    },

    uploadRecurso: async (formData) => {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/recursos/upload`, { 
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData 
        });

        return safeJsonFetch(res);
    },

    editarRecurso: async (id, payload) => {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/recursos/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        return safeJsonFetch(res);
    },

    apagarRecurso: async (id) => {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/recursos/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok && res.status !== 204) {
            const text = await res.text();
            console.error("Erro ao apagar recurso:", text);
            throw new Error("Falha ao apagar recurso");
        }

        return res.status === 204 || res.ok;
    },

    // ---------------------- AVALIAÇÕES
    criarAvaliacao: async (id, payload) => {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/recursos/${id}/avaliacoes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        return safeJsonFetch(res);
    }
};
