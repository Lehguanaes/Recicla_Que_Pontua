export default function ProfileNotice({
  className = "",
  icon,
  title,
  text,
  actionText,
  onAction,
}) {
  return (
    <div className={`perfil-alerta${className ? ` ${className}` : ""}`}>
      {icon}
      <div className="perfil-alerta-texto">
        <strong>{title}</strong>
        <p>{text}</p>
      </div>
      <div className="perfil-alerta-acoes">
        <button
          type="button"
          className="perfil-alerta-botao"
          onClick={onAction}
        >
          {actionText}
        </button>
      </div>
    </div>
  );
}
