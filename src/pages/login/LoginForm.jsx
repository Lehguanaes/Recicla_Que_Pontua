export default function LoginForm({
  identifier, setIdentifier,
  password, setPassword,
  showPassword, setShowPassword,
  onLogin,
  onCadastrar,
}) {
  return (
    <div className="auth-panel">
      <h1>
        Que bom ver <span>você</span> de novo!
      </h1>
      <p className="subtitle">
        Entre na sua conta para registrar seus materiais,
        acompanhar o ranking e transformar atitudes em pontos.
      </p>

      <div className="input-group">
        <input
          type="text"
          placeholder="E-mail ou telefone"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />
      </div>

      <div className="input-group">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="button"
          className="show-password"
          onClick={() => setShowPassword((v) => !v)}
        />
      </div>

      <a href="/recuperar-senha" className="forgot">
        Esqueceu sua senha?
      </a>

      <button className="login-button" onClick={onLogin}>
        Entrar
      </button>

      <p className="register">
        Ainda não possui conta?{" "}
        <button type="button" className="link-btn" onClick={onCadastrar}>
          Cadastre-se
        </button>
      </p>
    </div>
  );
}
