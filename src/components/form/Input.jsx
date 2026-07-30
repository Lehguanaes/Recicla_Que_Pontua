export default function Input({
  invalid = false,
  className = "",
  ...props
}) {
  const classes = [className, invalid ? "error" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <input
      className={classes || undefined}
      aria-invalid={invalid || undefined}
      {...props}
    />
  );
}
