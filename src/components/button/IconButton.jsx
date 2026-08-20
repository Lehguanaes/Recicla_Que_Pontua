import "./iconButton.css";

/**
 * Botão reutilizável para ações representadas somente por um ícone.
 *
 * `label` é obrigatório para que leitores de tela entendam a ação. Classes
 * específicas podem continuar sendo usadas pelas páginas para preservar
 * posicionamento, formato e identidade visual existentes.
 */
export default function IconButton({
  icon,
  children,
  label,
  className = "",
  variant = "plain",
  size,
  pressed,
  loading = false,
  disabled = false,
  type = "button",
  ...props
}) {
  const classes = [
    "icon-button",
    `icon-button--${variant}`,
    size ? `icon-button--${size}` : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const pressedProps =
    typeof pressed === "boolean" ? { "aria-pressed": pressed } : {};

  return (
    <button
      {...props}
      {...pressedProps}
      type={type}
      className={classes}
      aria-label={label}
      aria-busy={loading || undefined}
      disabled={disabled || loading}
    >
      <span className="icon-button__content" aria-hidden="true">
        {icon ?? children}
      </span>
    </button>
  );
}
