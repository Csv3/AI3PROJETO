import React, { useState } from "react";

export default function Comentarios({ comentarios = [], onCreate, onEdit, onDelete }) {
  const [text, setText] = useState("");
  return (
    <section>
      <h4>Comentários</h4>
      <form onSubmit={e => { e.preventDefault(); onCreate({ comentario: text }); setText(""); }}>
        <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Escreve um comentário..." required />
        <button>Enviar</button>
      </form>

      <ul className="list">
        {comentarios.map(c => (
          <li key={c._id || c.id}>
            <div>{c.comentario}</div>
            <small>{new Date(c.createdAt || c.data || c.updatedAt || Date.now()).toLocaleString()}</small>
            <div className="item-actions">
              {onEdit && <button onClick={() => {
                const novo = prompt("Editar comentário:", c.comentario);
                if (novo !== null) onEdit(c._id || c.id, { comentario: novo });
              }}>Editar</button>}
              {onDelete && <button onClick={() => onDelete(c._id || c.id)}>Apagar</button>}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
