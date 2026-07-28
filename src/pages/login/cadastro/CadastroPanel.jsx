import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { db } from "../../../services/Firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { FaArrowLeft, FaUserEdit } from "react-icons/fa";
import Alert from "../../../components/alert/Alert";
import { camposPorPerfil, perfilInfo } from "./CadastroData";
import { validarCadastro } from "../../../utils/AuthValidation";
import { validarCampos } from "../../../utils/AuthValidation";
import CadastroFields from "./CadastroFields";
import PasswordFields from "./PasswordFields";

import './cadastro.css';

export default function CadastroPanel({
  perfilSelecionado,
  onVoltarPerfil,
  onVoltarLogin,
}) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmCadastroOpen, setConfirmCadastroOpen] = useState(false);
  const [cadastrando, setCadastrando] = useState(false);

  const secoes = camposPorPerfil[perfilSelecionado] || [];
  const secoesEtapaUm = secoes.slice(0, 1);
  const secoesEtapaDois = secoes.slice(1);
  const camposEtapaUm = secoesEtapaUm.flatMap((secao) => secao.campos);
  const camposEtapaDois = secoesEtapaDois.flatMap((secao) => secao.campos);
  const perfil = perfilInfo[perfilSelecionado];
  const { cadastrar } = useAuth();
  const [aceitouTermos, setAceitouTermos] = useState(false);


  //FUNÇÕES
  function validarPrimeiraEtapa() {
    const novosErros = validarCampos(
      camposEtapaUm,
      formData
    );

    setErrors(novosErros);

    if (Object.keys(novosErros).length === 0) {
      setStep(2);
    }

  }

  function validarSegundaEtapa() {
    const novosErros = validarCampos(
      camposEtapaDois,
      formData
    );

    setErrors(novosErros);

    if (Object.keys(novosErros).length === 0) {
      setStep(3);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    const novosErros = validarCadastro(password, confirmPassword);

    if (!aceitouTermos) {
      novosErros.termos = "Você deve aceitar os Termos de Uso.";
    }

    setErrors(novosErros);

    if (Object.keys(novosErros).length > 0) return;
    setConfirmCadastroOpen(true);
  }

  async function handleConfirmCadastro() {
  setCadastrando(true);
  try {
    // Cria usuário no Firebase Authentication
    const usuario = await cadastrar(
      formData.email,
      password
    );

    // Cidade e estado ficam agrupados dentro de "endereco", junto com o
    // que o usuário puder complementar depois na tela de Perfil (rua,
    // número, bairro, complemento). Só o CEP é salvo como campo separado.
    const { cidade, estado, ...outrosCampos } = formData;

    // Salva dados no Firestore
    await setDoc(doc(db, "usuarios", usuario.uid), {
      ...outrosCampos,

      endereco: {
        cidade: cidade || "",
        estado: estado || "",
      },

      uid: usuario.uid,
      email: usuario.email,
      perfil: perfilSelecionado,

      pontos: 0,

      aceitouTermos: true,
      aceitouEm: serverTimestamp(),

      criadoEm: serverTimestamp(),
    });

    setConfirmCadastroOpen(false);
    navigate("/perfil");

  } catch (error) {
    setConfirmCadastroOpen(false);

    switch (error.code) {

      case "auth/email-already-in-use":
        setErrors(prev => ({
          ...prev,
          email: "Este e-mail já está cadastrado.",
        }));
        break;

      case "auth/invalid-email":
        setErrors(prev => ({
          ...prev,
          email: "E-mail inválido.",
        }));
        break;

      case "auth/weak-password":
        setErrors(prev => ({
          ...prev,
          senha: "A senha deve possuir pelo menos 6 caracteres.",
        }));
        break;

      case "auth/network-request-failed":
        setErrors(prev => ({
          ...prev,
          geral: "Sem conexão com a internet.",
        }));
        break;

      default:
        setErrors(prev => ({
          ...prev,
          geral: "Não foi possível criar sua conta.",
        }));
    }
  } finally {
    setCadastrando(false);
  }
}

  return (
    <div className="auth-panel">
      <h1>
        Criar <span className="destaque-titulo">conta</span>
      </h1>

      {step === 1 && (
        <p className="subtitle">
          Cadastre-se e transforme sua reciclagem em impacto positivo para você, para a comunidade e para o planeta.
        </p>
      )}

      <button
        type="button"
        className="perfil-badge"
        onClick={step === 1 ? onVoltarPerfil : () => setStep((etapaAtual) => etapaAtual - 1)}
        aria-label={step === 1 ? "Trocar Perfil" : "Voltar para a etapa anterior"}
        title={step === 1 ? "Trocar Perfil" : "Voltar"}
      >
        {step === 1 ? (
          <>
            <FaUserEdit size={17} aria-hidden="true" />
            <span>Trocar Perfil</span>
          </>

        ) : (
          <>
            <FaArrowLeft size={17} aria-hidden="true" />
            <span>Voltar</span>
          </>
        )}
      </button>

      <form
        className="cadastro-form"
        onSubmit={handleSubmit}
        noValidate
      >
        {step === 1 && (
          <>
            <CadastroFields
              secoes={secoesEtapaUm}
              formData={formData}
              errors={errors}
              setFormData={setFormData}
              setErrors={setErrors}
            />

            <div className="cadastro-actions">
              <button type="button" className="next-button" onClick={validarPrimeiraEtapa}>
                Continuar
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <CadastroFields
              secoes={secoesEtapaDois}
              formData={formData}
              errors={errors}
              setFormData={setFormData}
              setErrors={setErrors}
            />

            <div className="cadastro-actions">
              <button type="button" className="next-button" onClick={validarSegundaEtapa}>
                Continuar
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h3 className="secao-titulo cadastro-seguranca-titulo">
              Segurança
            </h3>

            <PasswordFields
              password={password}
              setPassword={setPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              errors={errors}
              setErrors={setErrors}
            />
          <div className="termos-container">
          <label
            htmlFor="aceitou-termos" className="checkbox-termos">
            <input id="aceitou-termos" type="checkbox"
              checked={aceitouTermos} onChange={(e) => setAceitouTermos(e.target.checked)}
            />
                    <span>Li e concordo com os{" "}
                    <Link
                      to="/termos" target="_blank"
                      rel="noopener noreferrer" className="link-btn"
                      >
                        Termos de Uso e Política de Privacidade
                      </Link>.
                    </span>
                  </label>
                </div>

                  <div className="cadastro-actions">
                    <button type="submit" 
                    className="register-button" 
                    disabled={!aceitouTermos}>
                      Criar conta
                    </button>
                  </div>
                </>
              )}
            </form>

      <Alert
        isOpen={confirmCadastroOpen}
        title="Tudo certo com seus dados?"
        message="Confira o resumo antes de criar sua conta."
        variant="success"
        confirmText="Criar minha conta"
        cancelText="Revisar dados"
        onConfirm={handleConfirmCadastro}
        onCancel={() => setConfirmCadastroOpen(false)}
        loading={cadastrando}
      >
        <div className="cadastro-confirm-summary">
          <div className="cadastro-confirm-heading">Resumo do cadastro</div>
          <dl>
            <div>
              <dt>Perfil</dt>
              <dd>{perfil?.label || "Não informado"}</dd>
            </div>
            <div>
              <dt>Nome</dt>
              <dd>{formData.nome || "Não informado"}</dd>
            </div>
            <div>
              <dt>E-mail</dt>
              <dd>{formData.email || "Não informado"}</dd>
            </div>
            <div>
              <dt>Localização</dt>
              <dd>{[formData.cidade, formData.estado].filter(Boolean).join(" - ") || "Não informada"}</dd>
            </div>
          </dl>
        </div>
      </Alert>

      <p className="register">
        Já tem uma conta?{" "}
        <button
          type="button"
          className="link-btn"
          onClick={onVoltarLogin}
        >
          Entrar
        </button>
      </p>
    </div>
  );
}

// TODO: adicionar a verificação de telefone e opções de tipos de instituição.
