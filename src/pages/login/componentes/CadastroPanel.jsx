import { useState } from "react";

const camposPorPerfil = {
  "pessoa-recicladora": [
    { name: "nome",     label: "Nome completo", type: "text",  placeholder: "Ex: João Silva",  required: true  },
    { name: "email",    label: "E-mail",        type: "email", placeholder: "joao@email.com",  required: true  },
    { name: "telefone", label: "Telefone",      type: "tel",   placeholder: "(11) 99999-9999", required: false },
    { name: "cidade",   label: "Cidade",        type: "text",  placeholder: "Ex: São Paulo",   required: true  },
  ],
  "catador-autonomo": [
    { name: "nome",     label: "Nome completo",     type: "text",  placeholder: "Ex: Maria Silva", required: true },
    { name: "email",    label: "E-mail",            type: "email", placeholder: "maria@email.com", required: true },
    { name: "telefone", label: "Telefone",          type: "tel",   placeholder: "(11) 99999-9999", required: true },
    { name: "regiao",   label: "Região de atuação", type: "text",  placeholder: "Ex: Zona Norte",  required: true },
  ],
  "instituicao-recicladora": [
    { name: "nome",   label: "Nome da instituição", type: "text",  placeholder: "Ex: Instituto Verde", required: true },
    { name: "cnpj",   label: "CNPJ",               type: "text",  placeholder: "00.000.000/0001-00",   required: true },
    { name: "email",  label: "E-mail",             type: "email", placeholder: "contato@inst.com",     required: true },
    { name: "cidade", label: "Cidade",             type: "text",  placeholder: "Ex: São Paulo",        required: true },
  ],
  "centro-coleta": [
    { name: "nome",     label: "Nome do centro", type: "text",  placeholder: "Ex: Ecoponto Central", required: true },
    { name: "cnpj",     label: "CNPJ",           type: "text",  placeholder: "00.000.000/0001-00",    required: true },
    { name: "email",    label: "E-mail",         type: "email", placeholder: "ecoponto@email.com",   required: true },
    { name: "endereco", label: "Endereço",       type: "text",  placeholder: "Rua, número, bairro",  required: true },
  ],
};

const perfilInfo = {
  "pessoa-recicladora":     { label: "Pessoa Recicladora"    },
  "catador-autonomo":       { label: "Catador Autônomo"      },
  "instituicao-recicladora":{ label: "Instituição Recicladora"},
  "centro-coleta":          { label: "Centro de Reciclagem"  },
};

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
    const novosErros = {};

    campos.forEach(({ name, required }) => {
      if (required && !formData[name]?.trim()) novosErros[name] = "Campo obrigatório.";
    });
    if (!password)             novosErros.senha = "Campo obrigatório.";
    else if (password.length < 6) novosErros.senha = "Mínimo de 6 caracteres.";
    if (password !== confirmPassword) novosErros.confirmSenha = "As senhas não coincidem.";

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
        {campos.map((campo) => (
          <div className="input-group" key={campo.name}>
            <input
              type={campo.type}
              placeholder={campo.placeholder}
              value={formData[campo.name] || ""}
              className={errors[campo.name] ? "error" : ""}
              onChange={(e) => {
                setFormData((p) => ({ ...p, [campo.name]: e.target.value }));
                setErrors((p) => ({ ...p, [campo.name]: undefined }));
              }}
            />
            {errors[campo.name] && <span className="form-error">{errors[campo.name]}</span>}
          </div>
        ))}

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
            {showPassword ? "🙈" : "👁"}
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
