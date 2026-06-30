import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./global.css";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Cadastro from "./pages/cadastro/Cadastro";
import ComoFunciona from "./pages/comoFunciona/ComoFunciona";
import Ranking from "./pages/ranking/Ranking";
import DoarMateriais from "./pages/doacao/DoarMateriais";
import Recompensas from "./pages/recompensas/Recompensas";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/como-funciona" element={<ComoFunciona />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/doacao/DoarMateriais" element={<DoarMateriais />} />
        <Route path="/recompensas" element={<Recompensas />} />
        <Route path="/buscarCatadores" element={<Navigate to="/doacao/DoarMateriais" replace />} />
        <Route path="/buscarcatadores" element={<Navigate to="/doacao/DoarMateriais" replace />} />
        <Route path="/sobre" element={<Navigate to="/como-funciona" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
