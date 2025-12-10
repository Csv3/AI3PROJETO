import { useState } from "react";
import { api } from "../api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const login = async () => {
    const data = await api.login(email, password);

    if (data.token) {
      localStorage.setItem("token", data.token);
      setMsg("Login feito com sucesso!");
    } else {
      setMsg(data.error || "Erro no login");
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} /><br/><br/>
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} /><br/><br/>

      <button onClick={login}>Entrar</button>
      <p>{msg}</p>
    </div>
  );
}
