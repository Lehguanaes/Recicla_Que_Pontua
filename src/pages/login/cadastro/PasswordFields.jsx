import Input from "../../../components/form/Input";
import PasswordInput from "../../../components/form/PasswordInput";
import FormMessage from "../../../components/form/FormMessage";

export default function PasswordFields({
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  showPassword,
  setShowPassword,
  errors,
  setErrors,
}) {
  return (
    <>
      <PasswordInput
        visible={showPassword}
        onToggle={() => setShowPassword((prev) => !prev)}
        containerClassName="input-group"
        buttonClassName="show-password"
        inputProps={{
          placeholder: "Senha (mínimo de 6 caracteres)",
          value: password,
          invalid: Boolean(errors.senha),
          onChange: (event) => {
            setPassword(event.target.value);
            setErrors((prev) => ({
              ...prev,
              senha: undefined,
            }));
          },
        }}
      >
        <FormMessage as="span" className="form-error">
          {errors.senha}
        </FormMessage>
      </PasswordInput>

      <div className="input-group">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Confirmar senha"
          value={confirmPassword}
          invalid={Boolean(errors.confirmSenha)}
          onChange={(event) => {
            setConfirmPassword(event.target.value);
            setErrors((prev) => ({
              ...prev,
              confirmSenha: undefined,
            }));
          }}
        />

        <FormMessage as="span" className="form-error">
          {errors.confirmSenha}
        </FormMessage>
      </div>
    </>
  );
}
