import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api.jsx";
import Comentarios from "../components/Comentarios.jsx";
import Avaliacoes from "../components/Avaliacoes.jsx";

export default function RecursoDetalhe() {
  const { id } = useParams();
  const [recurso, setRecurso] = useState(null);

  async function load() {
    try {
      const r = await api.obterRecurso(id);
      setRecurso(r);
    } catch (err) { alert(err.message); }
  }

  useEffect(() => { load(); }, [id]);

  async function criarComentario(payload) {
    await api.criarComentario(id, payload);
    load();
  }
  async function editarComentario(comentarioId, payload) {
    await api.editarComentario(id, comentarioId, payload);
    load();
  }
  async function apagarComentario(comentarioId) {
    if (!confirm("Apagar comentário?")) return;
    await api.apagarComentario(id, comentarioId);
    load();
  }

  async function criarAvaliacao(payload) {
    await api.criarAvaliacao(id, payload);
    load();
  }
  async function editarAvaliacao(avId, payload) {
    await api.editarAvaliacao(id, avId, payload);
    load();
  }
  async function apagarAvaliacao(avId) {
    if (!confirm("Apagar avaliação?")) return;
    await api.apagarAvaliacao(id, avId);
    load();
  }

  if (!recurso) return <p>Carregando...</p>;

  return (
    <div>
      <h2>{recurso.titulo}</h2>
      <p>{recurso.descricao}</p>
      <small>{recurso.categoria}</small>

      <hr />
      <Comentarios comentarios={recurso.comentarios || []} onCreate={criarComentario} onEdit={editarComentario} onDelete={apagarComentario} />
      <hr />
      <Avaliacoes avaliacoes={recurso.avaliacoes || []} onCreate={criarAvaliacao} onEdit={editarAvaliacao} onDelete={apagarAvaliacao} />
    </div>
  );
}
