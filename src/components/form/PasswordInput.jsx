import { FaEye, FaEyeSlash } from "react-icons/fa";
import Input from "./Input";
import IconButton from "../button/IconButton";

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
      <IconButton
        className={buttonClassName}
        onClick={onToggle}
        label={visible ? hideLabel : showLabel}
        pressed={visible}
      >
        {visible ? <FaEyeSlash /> : <FaEye />}
      </IconButton>
      {children}
    </div>
  );
}
