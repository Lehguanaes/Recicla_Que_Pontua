import { useState } from "react";
import ReciclaMais from "../../assets/ReciclaMais.png";
import Navbar from "../../components/navbar/Navbar";
import Rodape from "../../components/rodape/Rodape";
import LoginForm     from "../login/LoginForm";
import CadastroPanel from "../login/cadastro/CadastroPanel";
import ModalPerfil   from "../login/cadastro/ModalPerfil";
import "./login.css";
import "../../global.css";

function Login() {
  // "login" | "cadastro" | "sucesso"
  const [panel, setPanel] = useState("login");

  // modal de seleção de perfil
  const [modalAberto,       setModalAberto]       = useState(false);
  const [perfilSelecionado, setPerfilSelecionado] = useState(null);

  // campos do login
  const [identifier,    setIdentifier]    = useState("");
  const [password,      setPassword]      = useState("");
  const [showPassword,  setShowPassword]  = useState(false);

  // nome para tela de sucesso
  const [nomeUsuario, setNomeUsuario] = useState("");

  function handleLogin() {
    alert(`Login com ${identifier}`);
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

      <div className="login-page">

        {/* ── Slider: só .login-panel desliza, imgLateral fica fixa ── */}
        <div className="login-slider">
          <div className={`login-slider-track ${panel !== "login" ? "slide-right" : ""}`}>

            {/* Painel 1 — Login */}
            <LoginForm
              identifier={identifier}     setIdentifier={setIdentifier}
              password={password}         setPassword={setPassword}
              showPassword={showPassword} setShowPassword={setShowPassword}
              onLogin={handleLogin}
              onCadastrar={handleCadastrar}
            />

            {/* Painel 2 — Cadastro ou Sucesso */}
            {panel === "sucesso" ? (
              <div className="login-panel">
                <div className="cadastro-success">
                  <p style={{ fontSize: "3rem" }}>🎉</p>
                  <h1>Conta criada <span>com sucesso!</span></h1>
                  <p className="subtitle">
                    Bem-vindo(a) ao <strong>Recicla que Pontua</strong>
                    {nomeUsuario ? `, ${nomeUsuario}` : ""}!{" "}
                    Agora você pode reciclar, acumular pontos e fazer a diferença.
                  </p>
                  <button className="login-button" onClick={handleVoltarLogin}>
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

        {/* Imagem lateral — não se move */}
        <div className="imgLateral">
          <img src={ReciclaMais} alt="Incentivo Reciclagem" />
        </div>

      </div>

      {/* Modal de seleção de perfil */}
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

export default Login;
