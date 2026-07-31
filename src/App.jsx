import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./global.css";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Perfil from './pages/perfil/Perfil';
import TermosUso from  './pages/termos/TermosUso'
import ComoFunciona from "./pages/comoFunciona/ComoFunciona";
import Ranking from "./pages/ranking/Ranking";
import EncontrarParceiros from "./pages/doacao/DoarMateriais";
import CadastrarMateriais from "./pages/doacao/CadastrarMateriais";
import Convite from "./pages/convites/Convite";
import Chat from "./pages/chat/Chat";
import RecuperarSenha from "./pages/login/RecuperarSenha";
import Avaliacao from "./pages/avaliacao/Avaliacao";
import ScrollToTop from "./components/routing/ScrollToTop";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Login iniciarCadastro />} />
        <Route path="/recuperar-senha" element={<RecuperarSenha />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/termos" element={<TermosUso />} />
        <Route path="/como-reciclar" element={<ComoFunciona />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/doacao/cadastrar-materiais" element={<CadastrarMateriais />} />
        <Route path="/doacao/encontrar-parceiros" element={<EncontrarParceiros />} />
        <Route path="/convites" element={<Convite />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/avaliacao" element={<Avaliacao />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
