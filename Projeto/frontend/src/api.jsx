const API_URL = "http://localhost:5000";

async function safeFetch(path, opts = {}) {
  const headers = opts.headers || {};
  // se o body for FormData não definimos Content-Type (browser faz isso)
  if (!headers["Content-Type"] && !(opts.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  const token = localStorage.getItem("token");
  if (token) headers["Authorization"] = "Bearer " + token;
  const res = await fetch(API_URL + path, { ...opts, headers });
  const text = await res.text().catch(() => "");
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch (e) { data = text; }
  if (!res.ok) {
    const err = (data && data.error) ? data.error : (data?.message || res.statusText);
    throw new Error(err || "Request failed");
  }
  return data;
}

export const api = {
  // agora recebe recaptchaToken e envia no body
  login: (email, password, recaptchaToken) =>
    safeFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password, recaptchaToken })
    }),

  register: (nome, email, password) =>
    safeFetch("/auth/register", { method: "POST", body: JSON.stringify({ nome, email, password }) }),

  me: () => safeFetch("/users/me"),

  listarRecursos: (q = {}) => {
    const params = new URLSearchParams(q).toString();
    return safeFetch("/recursos" + (params ? `?${params}` : ""));
  },

  obterRecurso: (id) => safeFetch(`/recursos/${id}`),

  criarRecurso: (payload) => safeFetch("/recursos", { method: "POST", body: JSON.stringify(payload) }),

  editarRecurso: (id, payload) => safeFetch(`/recursos/${id}`, { method: "PUT", body: JSON.stringify(payload) }),

  apagarRecurso: (id) => safeFetch(`/recursos/${id}`, { method: "DELETE" }),

  uploadRecurso: (formData) => safeFetch("/recursos/upload", { method: "POST", body: formData }),

  listarAvaliacoes: (id) => safeFetch(`/recursos/${id}/avaliacoes`),

  criarAvaliacao: (id, payload) => safeFetch(`/recursos/${id}/avaliacoes`, { method: "POST", body: JSON.stringify(payload) }),

  editarAvaliacao: (id, avaliacaoId, payload) => safeFetch(`/recursos/${id}/avaliacoes/${avaliacaoId}`, { method: "PUT", body: JSON.stringify(payload) }),

  apagarAvaliacao: (id, avaliacaoId) => safeFetch(`/recursos/${id}/avaliacoes/${avaliacaoId}`, { method: "DELETE" }),

  listarComentarios: (id) => safeFetch(`/recursos/${id}/comentarios`),

  criarComentario: (id, payload) => safeFetch(`/recursos/${id}/comentarios`, { method: "POST", body: JSON.stringify(payload) }),

  editarComentario: (id, comentarioId, payload) => safeFetch(`/recursos/${id}/comentarios/${comentarioId}`, { method: "PUT", body: JSON.stringify(payload) }),

  apagarComentario: (id, comentarioId) => safeFetch(`/recursos/${id}/comentarios/${comentarioId}`, { method: "DELETE" })
};
