import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { api } from "../api.jsx";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const recaptchaRef = useRef(null);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (!recaptchaToken) {
      alert("Por favor confirma o reCAPTCHA antes de entrar.");
      return;
    }

    try {
      console.log("Enviando login...", { email, recaptchaToken });
      const res = await api.login(email, password, recaptchaToken);
      console.log("Resposta do /auth/login:", res);

      // limpar widget
      try { recaptchaRef.current?.reset(); } catch(_) {}
      setRecaptchaToken(null);

      if (res && res.token) {
        localStorage.setItem("token", res.token);
        console.log("Token guardado em localStorage:", localStorage.getItem("token"));

        // tenta navegar normalmente
        navigate("/recursos");

        // pequena verificação: se depois de 200ms ainda estamos na /login, força reload (fallback)
        setTimeout(() => {
          if (window.location.pathname === "/login" || window.location.pathname === "/") {
            console.warn("Navegação não ocorreu — forçando reload para aplicar token");
            window.location.href = "/recursos";
          }
        }, 200);
      } else {
        alert("Resposta inválida do servidor: " + JSON.stringify(res));
      }
    } catch (err) {
      try { recaptchaRef.current?.reset(); } catch(_) {}
      setRecaptchaToken(null);
      console.error("Erro no login:", err);
      alert(err.message || "Erro no login");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2>Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />

      <div style={{ margin: "12px 0" }}>
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
          onChange={(token) => setRecaptchaToken(token)}
          onExpired={() => setRecaptchaToken(null)}
        />
      </div>

      <button>Entrar</button>
    </form>
  );
}
