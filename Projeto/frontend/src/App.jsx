import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Recursos from "./pages/Recursos.jsx";
import RecursoDetalhe from "./pages/RecursosDetalhe.jsx";
import Navbar from "./components/Navbar.jsx";

export default function App() {
  const token = localStorage.getItem("token");
  return (
    <>
      <Navbar />
      <main style={{ padding: 16 }}>
        <Routes>
          <Route path="/" element={<Navigate to="/recursos" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/recursos" element={token ? <Recursos /> : <Navigate to="/login" />} />
          <Route path="/recursos/:id" element={token ? <RecursoDetalhe /> : <Navigate to="/login" />} />
        </Routes>
      </main>
    </>
  );
}
