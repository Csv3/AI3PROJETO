import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{ padding: 20, display: "flex", gap: 20 }}>
      <Link to="/">🏠 Home</Link>
      <Link to="/login">🔐 Login</Link>
      <Link to="/recursos">📄 Recursos</Link>
      <Link to="/criar">➕ Criar Avaliação</Link>
    </nav>
  );
}
