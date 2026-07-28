import { FaEye, FaEyeSlash } from "react-icons/fa";
/*import {
  calcStrength,
  strengthConfig,
} from "../../../utils/PasswordStrength";*/

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
  //const strength = calcStrength(password);

  return (
    <>
      {/* Senha */}
      <div className="input-group">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Senha (mínimo de 6 caracteres)"
          value={password}
          className={errors.senha ? "error" : ""}
          onChange={(e) => {
            setPassword(e.target.value);

            setErrors((prev) => ({
              ...prev,
              senha: undefined,
            }));
          }}
        />

        <button
          type="button"
          className="show-password"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
{/* 
        {password && (
          <>
            <div className="strength-bar">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`strength-segment ${
                    i < strength
                      ? strengthConfig[strength - 1].color
                      : ""
                  }`}
                />
              ))}
            </div>

            <span
              className="strength-label"
              style={{
                color:
                  ["var(--color-danger)", "var(--color-brand-orange-hover)", "var(--color-brand-green-medium)"][strength - 1] || "var(--color-text-placeholder)",
              }}
            >
              {strength > 0
                ? strengthConfig[strength - 1].label
                : ""}
            </span>
          </>
        )} /
*/} 

        {errors.senha && (
          <span className="form-error">
            {errors.senha}
          </span>
        )}
      </div>

      {/* Confirmar senha */}
      <div className="input-group">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Confirmar senha"
          value={confirmPassword}
          className={errors.confirmSenha ? "error" : ""}
          onChange={(e) => {
            setConfirmPassword(e.target.value);

            setErrors((prev) => ({
              ...prev,
              confirmSenha: undefined,
            }));
          }}
        />
        

        {errors.confirmSenha && (
          <span className="form-error">
            {errors.confirmSenha}
          </span>
        )}
      </div>
    </>
  );
}
