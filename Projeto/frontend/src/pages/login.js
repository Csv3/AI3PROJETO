import { useState } from "react";
import { api } from "../api"; // ⚠️ Verifique se o caminho para 'api.js' está correto

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const login = async () => {
    // 1. Limpa a mensagem e verifica se os campos estão preenchidos
    setMsg("A tentar login...");
    if (!email || !password) {
      setMsg("Por favor, preencha o email e a password.");
      return;
    }

    try {
      // 2. Chama a função de login na sua API (sem enviar o token CAPTCHA)
      const data = await api.LOGIN(email, password); 

      // 3. Trata a resposta do backend
      if (data.token) {
        localStorage.setItem("token", data.token);
        setMsg("✅ Login feito com sucesso! Token armazenado.");
        // Opcional: Redirecionar o usuário para a página Home ou Dashboard aqui
      } else {
        // Se houver um campo 'error' na resposta
        setMsg(`❌ Login falhou: ${data.error || "Credenciais inválidas."}`);
      }
    } catch (error) {
      // Erro de rede (servidor offline, CORS, URL da API incorreta)
      console.error("Erro na comunicação com a API:", error);
      setMsg("🚨 Erro de conexão. O servidor backend está a correr?");
    }
  };

  return (
    <div>
      <h2>🔐 Login Simples (Para Teste)</h2>

      {/* Uso de um formulário para permitir a submissão com Enter */}
      <form onSubmit={(e) => { e.preventDefault(); login(); }}>
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

        <button type="submit">Entrar</button>
      </form>

      <p style={{ marginTop: '15px', fontWeight: 'bold' }}>{msg}</p>
    </div>
  );
}