import { useState } from "react";
import Modal from "../../components/modal/Modal";
import SelecionarUser from "./components/selecionarUser/SelecionarUser";
import "./cadastro.css";


const camposPorPerfil = {
  "pessoa-recicladora": [
    { name: "nome",     label: "Nome completo", type: "text",  placeholder: "Ex: João Silva",  required: true  },
    { name: "email",    label: "E-mail",        type: "email", placeholder: "joao@email.com",  required: true  },
    { name: "telefone", label: "Telefone",      type: "tel",   placeholder: "(11) 99999-9999", required: false },
    { name: "cidade",   label: "Cidade",        type: "text",  placeholder: "Ex: São Paulo",   required: true  },
  ],
  "catador-autonomo": [
    { name: "nome",     label: "Nome completo",    type: "text",  placeholder: "Ex: Maria Silva",  required: true },
    { name: "email",    label: "E-mail",           type: "email", placeholder: "maria@email.com",  required: true },
    { name: "telefone", label: "Telefone",         type: "tel",   placeholder: "(11) 99999-9999",  required: true },
    { name: "regiao",   label: "Região de atuação",type: "text",  placeholder: "Ex: Zona Norte",   required: true },
  ],
  "instituicao-recicladora": [
    { name: "nome",    label: "Nome da instituição", type: "text",  placeholder: "Ex: Instituto Verde",  required: true },
    { name: "cnpj",   label: "CNPJ",                type: "text",  placeholder: "00.000.000/0001-00",    required: true },
    { name: "email",  label: "E-mail",              type: "email", placeholder: "contato@inst.com",      required: true },
    { name: "cidade", label: "Cidade",              type: "text",  placeholder: "Ex: São Paulo",         required: true },
  ],
  "centro-coleta": [
    { name: "nome",      label: "Nome do centro", type: "text",  placeholder: "Ex: Ecoponto Central",  required: true },
    { name: "cnpj",      label: "CNPJ",           type: "text",  placeholder: "00.000.000/0001-00",     required: true },
    { name: "email",     label: "E-mail",         type: "email", placeholder: "ecoponto@email.com",    required: true },
    { name: "endereco",  label: "Endereço",       type: "text",  placeholder: "Rua, número, bairro",   required: true },
  ],
};

/* ════════════════════════════════
   CORRIGIDO: label para todos os 4 perfis (sem icon, pois usam imagem)
════════════════════════════════ */
const perfilInfo = {
  "pessoa-recicladora":     { label: "Pessoa Recicladora"   },
  "catador-autonomo":       { label: "Catador Autônomo"     },
  "instituicao-recicladora":{ label: "Instituição Recicladora" },
  "centro-coleta":          { label: "Centro de Reciclagem" },
};

/* ════════════════════════════════
   Força da senha
════════════════════════════════ */
function calcStrength(pwd) {
  if (!pwd) return 0;
  let score = 0;
  if (pwd.length >= 6)  score++;
  if (pwd.length >= 10) score++;
  if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) score++;
  return score;
}

const strengthConfig = [
  { label: "Fraca",  color: "weak"   },
  { label: "Média",  color: "medium" },
  { label: "Forte",  color: "strong" },
];

/* ════════════════════════════════
   Componente principal
════════════════════════════════ */
function Cadastro() {
  const [step, setStep] = useState(1);
  const [modalOpen, setModalOpen] = useState(true);
  const [perfilSelecionado, setPerfilSelecionado] = useState(null);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const strength = calcStrength(password);

  /*function handleConfirmPerfil() {
    if (!perfilSelecionado) return;
    setModalOpen(false);
    setStep(2);
  }*/

  function handleSubmit(e) {
    e.preventDefault();
    const campos = camposPorPerfil[perfilSelecionado] || [];
    const novosErros = {};

    campos.forEach(({ name, required }) => {
      if (required && !formData[name]?.trim()) {
        novosErros[name] = "Campo obrigatório.";
      }
    });

    if (!password) {
      novosErros.senha = "Campo obrigatório.";
    } else if (password.length < 6) {
      novosErros.senha = "Mínimo de 6 caracteres.";
    }

    if (password !== confirmPassword) {
      novosErros.confirmSenha = "As senhas não coincidem.";
    }

    setErrors(novosErros);
    if (Object.keys(novosErros).length > 0) return;

    setStep(3);
  }

  function handleReset() {
    setStep(1);
    setModalOpen(true);
    setPerfilSelecionado(null);
    setFormData({});
    setErrors({});
    setPassword("");
    setConfirmPassword("");
  }

  const campos = camposPorPerfil[perfilSelecionado] || [];
  const perfil = perfilInfo[perfilSelecionado];

  return (
    <div className="cadastro-page">

      {/* Step indicator */}
      <div className="cadastro-steps">
        {[1, 2, 3].map((s, i) => (
          <span key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span className={`step-dot ${step === s ? "active" : step > s ? "done" : ""}`} />
            {i < 2 && <span className="step-line" />}
          </span>
        ))}
      </div>

      {/* Modal de seleção de perfil */}
      <Modal isOpen={modalOpen} onClose={() => {}}>
        <SelecionarUser
          selected={perfilSelecionado}
          onSelect={setPerfilSelecionado}
        />

      {/*Depois que o usuário clicar é já para direcionar para a tela de cadastro com o forms*/}
      </Modal>

      {/* Formulário de cadastro */}
      {step === 2 && (
        <div className="cadastro-card">

          {/* CORRIGIDO: removido perfil.icon (perfis usam imagem, não emoji) */}
          <button
            className="perfil-badge"
            onClick={() => { setModalOpen(true); setStep(1); }}
          >
            {perfil?.label} · Trocar
          </button>

          <h1 className="cadastro-title">Criar conta</h1>
          <p className="cadastro-subtitle">Preencha os dados abaixo para concluir seu cadastro.</p>

          <form className="cadastro-form" onSubmit={handleSubmit} noValidate>

            {campos.map((campo) => (
              <div className="form-group" key={campo.name}>
                <label htmlFor={campo.name}>{campo.label}</label>
                <input
                  id={campo.name}
                  type={campo.type}
                  placeholder={campo.placeholder}
                  value={formData[campo.name] || ""}
                  className={errors[campo.name] ? "error" : ""}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, [campo.name]: e.target.value }));
                    setErrors((prev) => ({ ...prev, [campo.name]: undefined }));
                  }}
                />
                {errors[campo.name] && (
                  <span className="form-error">{errors[campo.name]}</span>
                )}
              </div>
            ))}

            {/* Senha */}
            <div className="form-group">
              <label htmlFor="senha">Senha</label>
              <div className="password-wrapper">
                <input
                  id="senha"
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  className={errors.senha ? "error" : ""}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((prev) => ({ ...prev, senha: undefined }));
                  }}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>

              {password && (
                <>
                  <div className="strength-bar">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className={`strength-segment ${i < strength ? strengthConfig[strength - 1].color : ""}`}
                      />
                    ))}
                  </div>
                  <span
                    className="strength-label"
                    style={{ color: ["#e53935", "#f57c00", "#43a047"][strength - 1] || "#aaa" }}
                  >
                    {strength > 0 ? strengthConfig[strength - 1].label : ""}
                  </span>
                </>
              )}
              {errors.senha && <span className="form-error">{errors.senha}</span>}
            </div>

            {/* Confirmar senha */}
            <div className="form-group">
              <label htmlFor="confirmSenha">Confirmar senha</label>
              <input
                id="confirmSenha"
                type="password"
                placeholder="Repita a senha"
                value={confirmPassword}
                className={errors.confirmSenha ? "error" : ""}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setErrors((prev) => ({ ...prev, confirmSenha: undefined }));
                }}
              />
              {errors.confirmSenha && (
                <span className="form-error">{errors.confirmSenha}</span>
              )}
            </div>

            <div className="cadastro-actions">
              <button
                type="button"
                className="btn-back"
                onClick={() => { setModalOpen(true); setStep(1); }}
              >
                ← Voltar
              </button>
              <button type="submit" className="btn-submit">
                Criar conta 🌿
              </button>
            </div>
          </form>

          <p className="cadastro-login">
            Já tem uma conta? <a href="/login">Entrar</a>
          </p>
        </div>
      )}

      {/* Sucesso */}
      {step === 3 && (
        <div className="cadastro-card">
          <div className="cadastro-success">
            <div className="success-icon">🎉</div>
            <h2 className="success-title">Conta criada com sucesso!</h2>
            <p className="success-sub">
              Bem-vindo(a) ao <strong>Recicla que Pontua</strong>, {formData.nome?.split(" ")[0]}!
              Agora você pode reciclar, acumular pontos e fazer a diferença.
            </p>
            <a
              href="/login"
              className="btn-submit"
              style={{ textDecoration: "none", padding: "13px 32px", borderRadius: 10, marginTop: 8 }}
            >
              Ir para o login →
            </a>
            <button
              onClick={handleReset}
              className="btn-back"
              style={{ width: "auto", padding: "10px 20px", fontSize: 13 }}
            >
              Fazer novo cadastro
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cadastro;

