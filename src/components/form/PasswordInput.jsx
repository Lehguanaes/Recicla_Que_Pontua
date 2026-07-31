import { FaEye, FaEyeSlash } from "react-icons/fa";
import Input from "./Input";

export default function PasswordInput({
  visible,
  onToggle,
  containerClassName = "",
  buttonClassName = "",
  showLabel = "Mostrar senha",
  hideLabel = "Ocultar senha",
  inputProps = {},
  children,
}) {
  return (
    <div className={containerClassName}>
      <Input {...inputProps} type={visible ? "text" : "password"} />
      <button
        type="button"
        className={buttonClassName}
        onClick={onToggle}
        aria-label={visible ? hideLabel : showLabel}
      >
        {visible ? <FaEyeSlash /> : <FaEye />}
      </button>
      {children}
    </div>
  );
}
