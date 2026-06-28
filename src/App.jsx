import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Login from './pages/login/Login'
import BuscarCatadores from './pages/BuscarCatadores'

/**
 * App root — adicione roteamento (React Router) conforme o projeto crescer
 */
function App() {
 return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/buscarCatadores" element={<BuscarCatadores />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
