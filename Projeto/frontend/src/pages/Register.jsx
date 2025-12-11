import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api.jsx";

export default function Register() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await api.register(nome, email, password);
      alert("Registado com sucesso. Inicia sessão.");
      navigate("/login");
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2>Registar</h2>
      <input placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} required />
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
      <button>Registar</button>
    </form>
  );
}
