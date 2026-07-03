import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { camposPorPerfil } from "./CadastroData";
import { validarCadastro , validarCampos } from "../../../auth/AuthValidation";
import CadastroFields from "./CadastroFields";
import PasswordFields from "./PasswordFields";
import './cadastro.css';

export default function CadastroPanel({
  perfilSelecionado,
  onVoltarPerfil,
  onSucesso,
  onVoltarLogin,
}) {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const secoes = camposPorPerfil[perfilSelecionado] || [];
  const campos = secoes.flatMap((secao) => secao.campos); 
  //const perfil = perfilInfo[perfilSelecionado];

  function validarPrimeiraEtapa() {
    const novosErros = {};

    campos.forEach(({ name, required }) => {
      if (required && !formData[name]?.trim()) {
        novosErros[name] = "Campo obrigatório.";
      }
    });

    setErrors(novosErros);

    if (Object.keys(novosErros).length === 0) {
      setStep(2);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    const novosErros = validarCadastro(
      campos,
      formData,
      password,
      confirmPassword
    );

    setErrors(novosErros);

    if (Object.keys(novosErros).length > 0) return;

    onSucesso(formData.nome);
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
          <span>Trocar perfil</span>
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
              <button
                type="button"
                className="next-button"
                onClick={validarPrimeiraEtapa}
              >
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

            <div className="cadastro-actions">
              <button
                type="submit"
                className="register-button"
              >
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