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
  onClick,
  ...props
}) {
  const classes = [
    "ui-button",
    `ui-button--${variant}`,
    className,
  ].filter(Boolean).join(" ");
  const content = loading ? loadingText : children;
  const isDisabled = disabled || loading;

  function handleLinkClick(event) {
    if (isDisabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    onClick?.(event);
  }

  if (to) {
    return (
      <Link
        className={`${classes}${isDisabled ? " is-disabled" : ""}`}
        to={to}
        {...props}
        aria-disabled={isDisabled || undefined}
        aria-busy={loading || undefined}
        tabIndex={isDisabled ? -1 : props.tabIndex}
        onClick={handleLinkClick}
      >
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        className={`${classes}${isDisabled ? " is-disabled" : ""}`}
        href={href}
        {...props}
        aria-disabled={isDisabled || undefined}
        aria-busy={loading || undefined}
        tabIndex={isDisabled ? -1 : props.tabIndex}
        onClick={handleLinkClick}
      >
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
      onClick={onClick}
      {...props}
    >
      {content}
    </button>
  );
}
