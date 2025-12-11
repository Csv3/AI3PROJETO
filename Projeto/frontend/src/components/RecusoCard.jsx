import React from "react";
import { Link } from "react-router-dom";

export default function RecursoCard({ recurso, onDelete, onEdit }) {
  return (
    <article className="card">
      <h3>{recurso.titulo}</h3>
      <p>{recurso.descricao}</p>
      <small>{recurso.categoria}</small>
      <div className="card-actions">
        <Link to={`/recursos/${recurso._id}`}>Ver</Link>
        {onEdit && <button onClick={() => onEdit(recurso)}>Editar</button>}
        {onDelete && <button onClick={() => onDelete(recurso._id)}>Apagar</button>}
      </div>
    </article>
  );
}
