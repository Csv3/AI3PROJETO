import { useState } from "react";
import { api } from "../api";

export default function Recursos() {
  const [lista, setLista] = useState([]);

  const carregar = async () => {
    const token = localStorage.getItem("token");
    const data = await api.listarRecursos(token);
    setLista(data);
  };

  return (
    <div>
      <h2>Lista de Recursos</h2>

      <button onClick={carregar}>Carregar Recursos</button>

      <ul>
        {lista.map(r => (
          <li key={r._id}>
            {r.titulo} — {r.descricao}
          </li>
        ))}
      </ul>
    </div>
  );
}
