import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { db } from "../../../services/Firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { FaArrowLeft } from "react-icons/fa";
import { camposPorPerfil } from "./CadastroData";
import { validarCadastro } from "../../../utils/AuthValidation";
import { validarCampos } from "../../../utils/AuthValidation";
import EditPerfil from '../../../assets/editPerfil.png';
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

  const secoes = camposPorPerfil[perfilSelecionado] || [];
  const campos = secoes.flatMap((secao) => secao.campos); 
  //const perfil = perfilInfo[perfilSelecionado];
  const { cadastrar } = useAuth();
  const [aceitouTermos, setAceitouTermos] = useState(false);


  //FUNÇÕES
  function validarPrimeiraEtapa() {
    const novosErros = validarCampos(
      campos,
      formData
    );

    setErrors(novosErros);

    if (Object.keys(novosErros).length === 0) {
      setStep(2);
    }

  }

  async function handleSubmit(e) {
  e.preventDefault();

  // Valida apenas os campos da segunda etapa
  const novosErros = validarCadastro(
    password,
    confirmPassword
  );

  // Verifica aceite dos termos
  if (!aceitouTermos) {
    novosErros.termos = "Você deve aceitar os Termos de Uso.";
  }

  setErrors(novosErros);

  if (Object.keys(novosErros).length > 0) return;

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

    navigate("/perfil");

  } catch (error) {

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
  }
}

  return (
    <div className="auth-panel">
      <h1>
        Criar <span>conta</span>
      </h1>

      <p className="subtitle">
        Cada atitude sustentável faz a diferença. Cadastre-se e transforme sua reciclagem em impacto positivo para você, para a comunidade e para o planeta.
      </p>

      <button
        className="perfil-badge"
        onClick={step === 1 ? onVoltarPerfil : () => setStep(1)}
      >
        {step === 1 ? (
          <img src={EditPerfil} alt="Troque de perfil" />

        ) : (
          <FaArrowLeft size={18} aria-label="Voltar para revisar seus dados" />
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
              secoes={secoes}
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

//Adicionar a verificção de telefone, adcionar options de tipos de intituição, cidade/estado tbm.