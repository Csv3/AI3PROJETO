import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/home";
import Login from "./pages/login";
import CriarAvaliacao from "./pages/criaravaliacao";
import Recursos from "./pages/recursos";
import Navbar from "./components/navbar";

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/recursos" element={<Recursos />} />
        <Route path="/criaravaliacao" element={<CriarAvaliacao />} />
      </Routes>
    </Router>
  );
}
