import { useState } from "react";
import { api } from "../api";

export default function CriarAvaliacao() {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [msg, setMsg] = useState("");

  const recursoId = "1"; // TROCAR PELO ID REAL

  const criar = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const data = await api.criarAvaliacao(token, recursoId, {
      titulo, descricao
    });

    if (data.error) setMsg(data.error);
    else setMsg("Avaliação criada!");
  };

  return (
    <div>
      <h1>Criar Avaliação</h1>

      <form onSubmit={criar}>
        <input placeholder="Título" value={titulo} onChange={e => setTitulo(e.target.value)} /><br/>
        <textarea placeholder="Descrição" value={descricao} onChange={e => setDescricao(e.target.value)} /><br/>

        <button type="submit">Criar</button>
      </form>

      <p>{msg}</p>
    </div>
  );
}
