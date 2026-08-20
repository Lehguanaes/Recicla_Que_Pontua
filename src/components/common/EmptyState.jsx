import "./emptyState.css";

export default function EmptyState({
  as: Element = "div",
  className = "",
  title,
  text,
  titleAs: Title = "h2",
  titleId,
  icon,
  iconAs: IconWrapper = "span",
  iconClassName = "",
  children,
}) {
  return (
    <Element
      className={["ui-empty-state", className].filter(Boolean).join(" ")}
      aria-labelledby={titleId || undefined}
    >
      {icon && (
        <IconWrapper
          className={["ui-empty-state-icon", iconClassName]
            .filter(Boolean)
            .join(" ")}
          aria-hidden="true"
        >
          {icon}
        </IconWrapper>
      )}
      <Title id={titleId}>{title}</Title>
      <p>{text}</p>
      {children}
    </Element>
  );
}
