const API_URL = "http://localhost:3000";

export const api = {
  login: async (email, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    return res.json();
  },

  listarRecursos: async (token) => {
    const res = await fetch(`${API_URL}/recursos`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.json();
  },

  criarAvaliacao: async (token, recursoId, payload) => {
    const res = await fetch(`${API_URL}/recursos/${recursoId}/avaliacoes`, {
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
