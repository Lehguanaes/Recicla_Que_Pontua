import { useState } from "react";
import {camposPorPerfil,perfilInfo} from "./CadastroData";
import { validarCadastro } from "../../../auth/AuthValidation";
import {calcStrength,strengthConfig} from "../../../auth/PasswordStrength";
import CadastroFields from "./CadastroFields";

export default function CadastroPanel({ perfilSelecionado, onVoltarPerfil, onSucesso, onVoltarLogin }) {
  const [formData,        setFormData]        = useState({});
  const [errors,          setErrors]          = useState({});
  const [password,        setPassword]        = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword,    setShowPassword]    = useState(false);

  const campos  = camposPorPerfil[perfilSelecionado] || [];
  const perfil  = perfilInfo[perfilSelecionado];
  const strength = calcStrength(password);

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
    <div className="login-panel">
      <h1>Criar <span>conta</span></h1>
      <p className="subtitle">
      Junte-se a uma comunidade que acredita que reciclar é mais do que descartar corretamente: é construir um futuro melhor. </p>

      <button className="perfil-badge" onClick={onVoltarPerfil}>
        Perfil Selecionado: {perfil?.label} | <span>Trocar</span>
      </button>

      <form className="cadastro-form" onSubmit={handleSubmit} noValidate>
        <CadastroFields
          campos={campos}
          formData={formData}
          errors={errors}
          setFormData={setFormData}
          setErrors={setErrors}
        />

        {/* Senha */}
        <div className="input-group">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Senha (mínimo 6 caracteres)"
            value={password}
            className={errors.senha ? "error" : ""}
            onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, senha: undefined })); }}
          />
          <button type="button" className="show-password" onClick={() => setShowPassword((v) => !v)}>
            {showPassword ? "?" : "👁"}
          </button>
          {password && (
            <>
              <div className="strength-bar">
                {[0, 1, 2].map((i) => (
                  <div key={i} className={`strength-segment ${i < strength ? strengthConfig[strength - 1].color : ""}`} />
                ))}
              </div>
              <span className="strength-label" style={{ color: ["#e53935","#f57c00","#43a047"][strength - 1] || "#aaa" }}>
                {strength > 0 ? strengthConfig[strength - 1].label : ""}
              </span>
            </>
          )}
          {errors.senha && <span className="form-error">{errors.senha}</span>}
        </div>

        {/* Confirmar senha */}
        <div className="input-group">
          <input
            type="password"
            placeholder="Confirmar senha"
            value={confirmPassword}
            className={errors.confirmSenha ? "error" : ""}
            onChange={(e) => { setConfirmPassword(e.target.value); setErrors((p) => ({ ...p, confirmSenha: undefined })); }}
          />
          {errors.confirmSenha && <span className="form-error">{errors.confirmSenha}</span>}
        </div>

        <div className="cadastro-actions">
          <button type="submit" className="login-button" style={{ flex: 2 }}>
            Criar conta
          </button>
        </div>
      </form>

      <p className="register">
        Já tem uma conta?{" "}
        <button type="button" className="link-btn" onClick={onVoltarLogin}>
          Entrar
        </button>
      </p>
    </div>
  );
}
