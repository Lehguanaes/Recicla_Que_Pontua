import "./form.css";

/**
 * Mensagem padronizada para validações e retornos de formulários.
 * Mantém as classes específicas recebidas por cada tela para preservar o
 * desenho atual enquanto centraliza cor, semântica e acessibilidade.
 */
export default function FormMessage({
  children,
  type = "error",
  as: Element = "p",
  className = "",
}) {
  if (children == null || children === "") return null;

  const role = type === "error" ? "alert" : "status";
  const classes = [
    "ui-form-message",
    `ui-form-message--${type}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Element className={classes} role={role} aria-live="polite">
      {children}
    </Element>
  );
}
