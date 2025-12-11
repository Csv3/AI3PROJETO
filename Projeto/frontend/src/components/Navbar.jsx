import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
  }
  return (
    <nav className="nav">
      <div className="nav-left">
        <Link to="/recursos">Recursos</Link>
      </div>
      <div className="nav-right">
        {!token ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Registar</Link>
          </>
        ) : (
          <button onClick={logout}>Sair</button>
        )}
      </div>
    </nav>
  );
}
