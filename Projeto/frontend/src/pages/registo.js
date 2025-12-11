import { useState } from "react";
import { api } from "../api"; // ⚠️ Verifique o caminho para 'api.js'

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    
    setMsg("A tentar registo...");
    
    if (!name || !email || !password) {
      setMsg("Por favor, preencha todos os campos.");
      return;
    }

    try {
      // 1. Chama a função de registo na sua API
      const data = await api.REGISTER(name, email, password); 

      // 2. Trata a resposta do backend
      if (data.token) {
        // Se o registo retornar um token (como é comum em APIs modernas)
        localStorage.setItem("token", data.token);
        setMsg("✅ Registo feito com sucesso! Pode agora fazer login.");
        // Opcional: Limpar campos
        setName('');
        setEmail('');
        setPassword('');
      } else {
        // Se houver um campo 'error' na resposta
        setMsg(`❌ Registo falhou: ${data.error || "Verifique os dados fornecidos."}`);
      }
    } catch (error) {
      // Erro de rede (servidor offline, CORS, URL da API incorreta)
      console.error("Erro na comunicação com a API:", error);
      setMsg("🚨 Erro de conexão. O servidor backend está a correr?");
    }
  };

  return (
    <div>
      <h2>✏️ Registo de Utilizador (Para Teste)</h2>

      <form onSubmit={handleRegister}>
        <input 
          placeholder="Nome" 
          value={name} 
          onChange={e => setName(e.target.value)} 
          required
        /><br/><br/>

        <input 
          placeholder="Email" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          type="email"
          required
        /><br/><br/>
        
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          required
        /><br/><br/>

        <button type="submit">Registar</button>
      </form>

      <p style={{ marginTop: '15px', fontWeight: 'bold' }}>{msg}</p>
    </div>
  );
}