import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import PetLogin from "../../assets/PetLogin.png";
import PageLayout from "../../components/layout/PageLayout";
import LoginForm from "../login/LoginForm";
import CadastroPanel from "../login/cadastro/CadastroPanel";
import ModalPerfil from "../login/modalPerfil/ModalPerfil";

import { useAuth } from "../../contexts/AuthContext";

import "./login.css";
import "../../global.css";

export default function Login({ iniciarCadastro = false }) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [erroLogin, setErroLogin] = useState("");

  const [panel, setPanel] = useState("login");

  // modal de seleção de perfil
  const [modalAberto, setModalAberto] = useState(false);
  const [perfilSelecionado, setPerfilSelecionado] = useState(null);

  // campos do login
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (iniciarCadastro) {
      setPanel("login");
      setModalAberto(true);
    }
  }, [iniciarCadastro]);


  //FUNÇÃO
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

  return (
    <>
      <PageLayout>

      <div className="auth-page">
        <div className="login-slider">
          <div className="login-slider-track">
            {panel === "login" ? (
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
            ) : (
              <CadastroPanel
                perfilSelecionado={perfilSelecionado}
                onVoltarPerfil={handleVoltarPerfil}
                onVoltarLogin={handleVoltarLogin}
              />
            )}
          </div>
        </div>

        {/* Imagem lateral */}
        <div className="imgLateral">
          <img
            className="pet-floating"
            src={PetLogin}
            alt="Incentivo Reciclagem"
          />
        </div>
      </div>

      <ModalPerfil
        isOpen={modalAberto}
        perfilSelecionado={perfilSelecionado}
        onSelect={setPerfilSelecionado}
        onConfirm={handleConfirmPerfil}
        onClose={() => setModalAberto(false)}
      />

      </PageLayout>
    </>
  );
}
