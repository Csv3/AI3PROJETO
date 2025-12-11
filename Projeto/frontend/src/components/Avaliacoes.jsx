import React, { useState } from "react";

export default function Avaliacoes({ avaliacoes = [], onCreate, onEdit, onDelete }) {
  const [estrelas, setEstrelas] = useState(5);
  const [comentario, setComentario] = useState("");
  return (
    <section>
      <h4>Avaliações</h4>
      <form onSubmit={e => { e.preventDefault(); onCreate({ estrelas: Number(estrelas), comentario }); setComentario(""); }}>
        <label>
          Estrelas:
          <select value={estrelas} onChange={e => setEstrelas(e.target.value)}>
            {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
        <textarea placeholder="Comentário (opcional)" value={comentario} onChange={e => setComentario(e.target.value)} />
        <button>Avaliar</button>
      </form>

      <ul className="list">
        {avaliacoes.map(a => (
          <li key={a._id || a.id}>
            <div>⭐ {a.estrelas} — {a.comentario}</div>
            <small>{new Date(a.createdAt || a.data || Date.now()).toLocaleString()}</small>
            <div className="item-actions">
              {onEdit && <button onClick={() => {
                const nova = Number(prompt("Novas estrelas (1-5):", a.estrelas));
                if (nova) onEdit(a._id || a.id, { estrelas: nova });
              }}>Editar</button>}
              {onDelete && <button onClick={() => onDelete(a._id || a.id)}>Apagar</button>}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
