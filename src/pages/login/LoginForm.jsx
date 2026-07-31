import { Link } from "react-router-dom";
import { PageHeader } from "../../components/typography/Typography";
import PasswordInput from "../../components/form/PasswordInput";
import Input from "../../components/form/Input";
import Button from "../../components/button/Button";
import './login.css';

export default function LoginForm({
  identifier, setIdentifier,
  password, setPassword,
  showPassword, setShowPassword, erroLogin,
  onLogin,
  onCadastrar,
}) {
  return (
    <div className="auth-panel">
      <PageHeader
        as="div"
        title={
          <>
            Seja <span className="destaque-titulo">muito</span> bem-vindo!
          </>
        }
        text="Entre na sua conta para registrar seus materiais, acompanhar o ranking e transformar atitudes em pontos."
        textClassName="subtitle"
      />

      <div className="input-group">
        <Input
          type="text"
          placeholder="E-mail"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />
      </div>

      <PasswordInput
        visible={showPassword}
        onToggle={() => setShowPassword((prev) => !prev)}
        containerClassName="input-group"
        buttonClassName="show-password"
        inputProps={{
          placeholder: "Senha",
          value: password,
          onChange: (e) => setPassword(e.target.value),
        }}
      />

      {erroLogin && (
        <span className="login-error">
          {erroLogin}
        </span>
      )}

      <Link to="/recuperar-senha" className="forgot">
        Esqueceu sua senha?
      </Link>

      <Button
        variant="gradient"
        className="login-button"
        onClick={onLogin}
      >
        Entrar
      </Button>

      <p className="register">
        Ainda não tem uma conta?{" "}
        <button type="button" className="link-btn" onClick={onCadastrar}>
          Cadastre-se
        </button>
      </p>
    </div>
  );
}
