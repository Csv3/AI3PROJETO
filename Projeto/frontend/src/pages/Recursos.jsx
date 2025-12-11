import React, { useEffect, useState } from "react";
import { api } from "../api.jsx";
import RecursoCard from "../components/RecusoCard.jsx";

export default function Recursos() {
  const [recursos, setRecursos] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("");
  const [editing, setEditing] = useState(null);

  async function load() {
    try {
      const data = await api.listarRecursos();
      setRecursos(data || []);
    } catch (err) {
      alert(err.message);
    }
  }

  async function criar(e) {
    e.preventDefault();
    try {
      if (editing) {
        await api.editarRecurso(editing._id, { titulo, descricao, categoria });
        setEditing(null);
      } else {
        await api.criarRecurso({ titulo, descricao, categoria });
      }
      setTitulo(""); setDescricao(""); setCategoria("");
      load();
    } catch (err) { alert(err.message); }
  }

  function startEdit(r) {
    setEditing(r);
    setTitulo(r.titulo); setDescricao(r.descricao); setCategoria(r.categoria);
  }

  async function apagar(id) {
    if (!confirm("Apagar este recurso?")) return;
    try {
      await api.apagarRecurso(id);
      load();
    } catch (err) { alert(err.message); }
  }

  useEffect(() => { load(); }, []);

  return (
    <div>
      <h2>Recursos</h2>
      <div className="grid">
        {recursos.map(r => (
          <RecursoCard key={r._id} recurso={r} onEdit={startEdit} onDelete={apagar} />
        ))}
      </div>

      <hr />
      <form onSubmit={criar} className="form">
        <h3>{editing ? "Editar Recurso" : "Criar Recurso"}</h3>
        <input placeholder="Título" value={titulo} onChange={e => setTitulo(e.target.value)} required />
        <textarea placeholder="Descrição" value={descricao} onChange={e => setDescricao(e.target.value)} required />
        <input placeholder="Categoria" value={categoria} onChange={e => setCategoria(e.target.value)} required />
        <button>{editing ? "Salvar" : "Criar"}</button>
        {editing && <button type="button" onClick={() => { setEditing(null); setTitulo(""); setDescricao(""); setCategoria(""); }}>Cancelar</button>}
      </form>
    </div>
  );
}
