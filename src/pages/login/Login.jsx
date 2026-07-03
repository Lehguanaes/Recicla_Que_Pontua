import { useState } from "react";
import { useNavigate } from "react-router-dom";

import ReciclaMais from "../../assets/ReciclaMais.png";
import Navbar from "../../components/navbar/Navbar";
import Rodape from "../../components/rodape/Rodape";
import LoginForm from "../login/LoginForm";
import CadastroPanel from "../login/cadastro/CadastroPanel";
import ModalPerfil from "../login/modalPerfil/ModalPerfil";

import { useAuth } from "../../contexts/AuthContext";

import "./login.css";
import "../../global.css";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [erroLogin, setErroLogin] = useState("");

  // "login" | "cadastro" | "sucesso"
  const [panel, setPanel] = useState("login");

  // modal de seleção de perfil
  const [modalAberto, setModalAberto] = useState(false);
  const [perfilSelecionado, setPerfilSelecionado] = useState(null);

  // campos do login
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // nome para tela de sucesso
  const [nomeUsuario, setNomeUsuario] = useState("");

  async function handleLogin() {
  setErroLogin("");

  try {
    await login(identifier, password);
    navigate("/perfil");

  } catch (error) {

    switch (error.code) {

      case "auth/invalid-credential":
      case "auth/user-not-found":
      case "auth/wrong-password":
        setErroLogin("E-mail ou senha incorretos.");
        break;

      case "auth/network-request-failed":
        setErroLogin("Sem conexão com a internet.");
        break;

      default:
        setErroLogin("Não foi possível fazer login.");
    }
  }
}

  // "Cadastre-se" → abre modal
  function handleCadastrar() {
    setModalAberto(true);
  }

  // confirma perfil no modal → fecha modal e desliza para cadastro
  function handleConfirmPerfil() {
    if (!perfilSelecionado) return;

    setModalAberto(false);
    setPanel("cadastro");
  }

  // "Trocar" no badge → reabre modal sem voltar ao login
  function handleVoltarPerfil() {
    setModalAberto(true);
  }

  // volta ao login deslizando
  function handleVoltarLogin() {
    setPanel("login");
  }

  // cadastro concluído → desliza para sucesso
  function handleSucesso(nome) {
    setNomeUsuario(nome?.split(" ")[0] || "");
    setPanel("sucesso");
  }

  return (
    <>
      <Navbar />

      <div className="auth-page">
        <div className="login-slider">
          <div
            className={`login-slider-track ${
              panel !== "login" ? "slide-right" : ""
            }`}
          >
            {/* LOGIN */}
            <LoginForm
              identifier={identifier}
              setIdentifier={setIdentifier}
              password={password}
              setPassword={setPassword}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              onLogin={handleLogin}
              erroLogin={erroLogin}
              onCadastrar={handleCadastrar}
            />

            {/* CADASTRO OU SUCESSO */}
            {panel === "sucesso" ? (
              <div className="auth-panel">
                <div className="cadastro-success">
                  <h1>
                    Conta criada <span>com sucesso!</span>
                  </h1>

                  <p className="subtitle">
                    Bem-vindo(a) ao <strong>Recicla que Pontua</strong>
                    {nomeUsuario ? `, ${nomeUsuario}` : ""}! Agora você pode
                    reciclar, acumular pontos e fazer a diferença.
                  </p>

                  <button
                    className="login-button"
                    onClick={handleVoltarLogin}
                  >
                    Ir para o login
                  </button>
                </div>
              </div>
            ) : (
              <CadastroPanel
                perfilSelecionado={perfilSelecionado}
                onVoltarPerfil={handleVoltarPerfil}
                onVoltarLogin={handleVoltarLogin}
                onSucesso={handleSucesso}
              />
            )}
          </div>
        </div>

        {/* Imagem lateral */}
        <div className="imgLateral">
          <img src={ReciclaMais} alt="Incentivo Reciclagem" />
        </div>
      </div>

      <ModalPerfil
        isOpen={modalAberto}
        perfilSelecionado={perfilSelecionado}
        onSelect={setPerfilSelecionado}
        onConfirm={handleConfirmPerfil}
        onClose={() => setModalAberto(false)}
      />

      <Rodape />
    </>
  );
}