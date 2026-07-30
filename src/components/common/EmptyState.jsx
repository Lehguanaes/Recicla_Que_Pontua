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
      className={className}
      aria-labelledby={titleId || undefined}
    >
      {icon && (
        <IconWrapper className={iconClassName} aria-hidden="true">
          {icon}
        </IconWrapper>
      )}
      <Title id={titleId}>{title}</Title>
      <p>{text}</p>
      {children}
    </Element>
  );
}
