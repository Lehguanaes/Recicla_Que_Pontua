import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { FaArrowLeft, FaEnvelope } from "react-icons/fa";

import Navbar from "../../components/navbar/Navbar";
import Rodape from "../../components/rodape/Rodape";
import Alert from "../../components/alert/Alert";
import { PageHeader } from "../../components/typography/Typography";
import Button from "../../components/button/Button";
import Input from "../../components/form/Input";
import { auth } from "../../services/Firebase";
import PetLogin from "../../assets/PetLogin.png";

import "./login.css";
import "./recuperarSenha.css";

export default function RecuperarSenha() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [avisoEnviado, setAvisoEnviado] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const emailNormalizado = email.trim();

    if (!emailNormalizado) {
      setErro("Informe o e-mail utilizado na sua conta.");
      return;
    }

    setErro("");
    setEnviando(true);

    try {
      await sendPasswordResetEmail(auth, emailNormalizado);
      setAvisoEnviado(true);
    } catch (error) {
      if (error.code === "auth/invalid-email") {
        setErro("Informe um endereço de e-mail válido.");
      } else if (error.code === "auth/too-many-requests") {
        setErro("Muitas tentativas foram realizadas. Aguarde um pouco e tente novamente.");
      } else if (error.code === "auth/network-request-failed") {
        setErro("Não foi possível conectar. Verifique sua internet e tente novamente.");
      } else {
        setErro("Não foi possível enviar o e-mail de recuperação. Tente novamente.");
      }
    } finally {
      setEnviando(false);
    }
  }

  return (
    <>
      <Navbar />

      <main className="auth-page recovery-page">
        <div className="login-slider">
          <div className="login-slider-track">
            <form className="auth-panel recovery-panel" onSubmit={handleSubmit}>
              <PageHeader
                as="div"
                eyebrowClassName="recovery-kicker"
                eyebrow="Recuperação de acesso"
                icon={<FaEnvelope />}
                title={
                  <>
                    Recupere sua{" "}
                    <span className="destaque-titulo">senha</span>
                  </>
                }
                text="Digite o e-mail cadastrado para receber as instruções de redefinição da sua senha."
                textClassName="subtitle"
              />

              <label className="recovery-label" htmlFor="recovery-email">
                E-mail
              </label>
              <div className="input-group recovery-input">
                <FaEnvelope aria-hidden="true" />
                <Input
                  id="recovery-email"
                  type="email"
                  value={email}
                  placeholder="seuemail@exemplo.com"
                  autoComplete="email"
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setErro("");
                  }}
                />
              </div>

              {erro && <span className="login-error">{erro}</span>}

              <Button
                variant="gradient"
                className="login-button"
                type="submit"
                disabled={enviando}
              >
                {enviando ? "Enviando..." : "Enviar link de recuperação"}
              </Button>

              <Link to="/login" className="recovery-back">
                <FaArrowLeft /> Voltar para o login
              </Link>
            </form>
          </div>
        </div>

        <div className="imgLateral">
          <img
            className="pet-floating"
            src={PetLogin}
            alt="Mascote do Recicla que Pontua"
          />
        </div>
      </main>

      <Rodape />

      <Alert
        isOpen={avisoEnviado}
        title="Confira seu e-mail"
        message="Se houver uma conta vinculada a esse endereço, você receberá um link para criar uma nova senha."
        variant="success"
        confirmText="Voltar para o login"
        showCancel={false}
        onConfirm={() => navigate("/login")}
        onCancel={() => setAvisoEnviado(false)}
      />
    </>
  );
}
