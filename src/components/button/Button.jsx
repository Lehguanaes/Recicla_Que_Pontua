import { Link } from "react-router-dom";
import "./button.css";

export default function Button({
  children,
  variant = "green",
  to,
  href,
  type = "button",
  className = "",
  disabled = false,
  loading = false,
  loadingText = "Carregando...",
  ...props
}) {
  const classes = [
    "ui-button",
    `ui-button--${variant}`,
    className,
  ].filter(Boolean).join(" ");
  const content = loading ? loadingText : children;
  const isDisabled = disabled || loading;

  if (to) {
    return (
      <Link className={classes} to={to} {...props}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a className={classes} href={href} {...props}>
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={isDisabled}
      aria-busy={loading}
      {...props}
    >
      {content}
    </button>
  );
}
