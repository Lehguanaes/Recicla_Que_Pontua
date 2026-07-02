import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./global.css";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import ComoFunciona from "./pages/comoFunciona/ComoFunciona";
import Ranking from "./pages/ranking/Ranking";
import EncontrarParceiros from "./pages/doacao/DoarMateriais";
import CadastrarMateriais from "./pages/doacao/CadastrarMateriais";
import Recompensas from "./pages/recompensas/Recompensas";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Navigate to="/login" replace />} />
        <Route path="/como-funciona" element={<ComoFunciona />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/doacao/cadastrar-materiais" element={<CadastrarMateriais />} />
        <Route path="/doacao/encontrarParceiros" element={<EncontrarParceiros />} />
        <Route path="/doacao/encontrar-parceiros" element={<Navigate to="/doacao/encontrarParceiros" replace />} />
        <Route path="/recompensas" element={<Recompensas />} />
        <Route path="/doacao/DoarMateriais" element={<Navigate to="/doacao/cadastrar-materiais" replace />} />
        <Route path="/buscarCatadores" element={<Navigate to="/doacao/cadastrar-materiais" replace />} />
        <Route path="/buscarcatadores" element={<Navigate to="/doacao/cadastrar-materiais" replace />} />
        <Route path="/sobre" element={<Navigate to="/como-funciona" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
