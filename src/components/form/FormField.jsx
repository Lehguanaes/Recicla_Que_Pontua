export default function FormField({
  as: Element = "div",
  id,
  label,
  hint,
  error,
  className = "",
  labelClassName = "",
  hintClassName = "",
  errorClassName = "",
  children,
}) {
  return (
    <Element className={className}>
      {label && (
        <label className={labelClassName || undefined} htmlFor={id}>
          {label}
        </label>
      )}

      {children}

      {hint && <span className={hintClassName || undefined}>{hint}</span>}
      {error && <span className={errorClassName || undefined}>{error}</span>}
    </Element>
  );
}
