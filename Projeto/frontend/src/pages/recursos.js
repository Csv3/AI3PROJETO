import React, { useEffect, useState } from "react";
import { api } from "../api";

export default function RecursosPage() {
  const [recursos, setRecursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ nome_recurso: "", tipo_recurso: "", nome_utilizador: "" });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  // -----------------------------
  // CARREGAR RECURSOS
  // -----------------------------
  const carregarRecursos = async () => {
    try {
      setLoading(true);
      const data = await api.listarRecursos();
      setRecursos(data);
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar recursos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarRecursos();
  }, []);

  // -----------------------------
  // HANDLES FORM
  // -----------------------------
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.editarRecurso(editingId, form);
        setEditingId(null);
      } else {
        await api.criarRecurso(form);
      }
      setForm({ nome_recurso: "", tipo_recurso: "", nome_utilizador: "" });
      carregarRecursos();
    } catch (err) {
      console.error(err);
      setError("Erro ao salvar recurso");
    }
  };

  const handleEdit = (recurso) => {
    setForm({
      nome_recurso: recurso.nome_recurso,
      tipo_recurso: recurso.tipo_recurso,
      nome_utilizador: recurso.nome_utilizador,
    });
    setEditingId(recurso._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que quer apagar este recurso?")) return;
    try {
      await api.apagarRecurso(id);
      carregarRecursos();
    } catch (err) {
      console.error(err);
      setError("Erro ao apagar recurso");
    }
  };

  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Recursos</h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* FORM */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-2">
          <input
            type="text"
            name="nome_recurso"
            placeholder="Nome do recurso"
            value={form.nome_recurso}
            onChange={handleChange}
            required
            className="border p-2 w-full"
          />
        </div>
        <div className="mb-2">
          <input
            type="text"
            name="tipo_recurso"
            placeholder="Tipo do recurso"
            value={form.tipo_recurso}
            onChange={handleChange}
            required
            className="border p-2 w-full"
          />
        </div>
        <div className="mb-2">
          <input
            type="text"
            name="nome_utilizador"
            placeholder="Nome do utilizador"
            value={form.nome_utilizador}
            onChange={handleChange}
            required
            className="border p-2 w-full"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 mt-2 rounded"
        >
          {editingId ? "Editar Recurso" : "Criar Recurso"}
        </button>
        {editingId && (
          <button
            type="button"
            className="bg-gray-500 text-white px-4 py-2 mt-2 ml-2 rounded"
            onClick={() => {
              setEditingId(null);
              setForm({ nome_recurso: "", tipo_recurso: "", nome_utilizador: "" });
            }}
          >
            Cancelar
          </button>
        )}
      </form>

      {/* LISTA */}
      {loading ? (
        <p>Carregando recursos...</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">Nome</th>
              <th className="p-2 text-left">Tipo</th>
              <th className="p-2 text-left">Utilizador</th>
              <th className="p-2 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {recursos.map((rec) => (
              <tr key={rec._id} className="border-b hover:bg-gray-100">
                <td className="p-2">{rec.nome_recurso}</td>
                <td className="p-2">{rec.tipo_recurso}</td>
                <td className="p-2">{rec.nome_utilizador}</td>
                <td className="p-2">
                  <button
                    className="bg-yellow-400 text-white px-2 py-1 rounded mr-2"
                    onClick={() => handleEdit(rec)}
                  >
                    Editar
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => handleDelete(rec._id)}
                  >
                    Apagar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
