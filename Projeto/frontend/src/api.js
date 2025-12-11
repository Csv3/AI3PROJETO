const API_URL = "http://localhost:3000";

export const api = {
    // ---------------------- AUTENTICAÇÃO

    login: async (email, password) => {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        return res.json();
    },

    REGISTER: async (name, email, password) => {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password })
        });
        return res.json();
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

        return res.json();
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

        return res.json();
    },

    uploadRecurso: async (formData) => {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_URL}/recursos/upload`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData
        });

        return res.json();
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

        return res.json();
    },

    apagarRecurso: async (id) => {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_URL}/recursos/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });

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

        return res.json();
    }
};
