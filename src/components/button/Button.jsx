import "./button.css";

export default function Button({
  children,
  onClick,
  type = "button",
  href,
  disabled = false,
  className = "",
}) {

  if (href) {
    return (
      <a
        href={href}
        className={`button ${className}`}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={`button ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

