import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Home from "./pages/home";
import Login from "./pages/login";
import Recursos from "./pages/recursos";
import CriarAvaliacao from "./pages/criaravaliacao";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div style={{ padding: 20 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/recursos" element={<Recursos />} />
          <Route path="/criar" element={<CriarAvaliacao />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
