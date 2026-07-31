function joinClassNames(...classNames) {
  return classNames.filter(Boolean).join(" ");
}

export function Eyebrow({
  as: Element = "span",
  icon,
  children,
  className = "",
}) {
  return (
    <Element className={joinClassNames("ui-eyebrow", className)}>
      {icon}
      {children}
    </Element>
  );
}

export function PageHeader({
  as: Element = "header",
  eyebrow,
  icon,
  title,
  text,
  titleId,
  textId,
  className = "",
  eyebrowClassName = "",
  titleClassName = "",
  textClassName = "",
  children,
}) {
  return (
    <Element className={joinClassNames("ui-page-header", className)}>
      {eyebrow && (
        <Eyebrow icon={icon} className={eyebrowClassName}>
          {eyebrow}
        </Eyebrow>
      )}

      <h1
        id={titleId}
        className={joinClassNames("ui-page-title", titleClassName)}
      >
        {title}
      </h1>

      {text != null && (
        <p
          id={textId}
          className={joinClassNames("ui-page-subtitle", textClassName)}
        >
          {text}
        </p>
      )}

      {children}
    </Element>
  );
}

export function SectionHeader({
  as: Element = "div",
  titleAs: Title = "h2",
  eyebrow,
  icon,
  title,
  text,
  titleId,
  textId,
  className = "",
  eyebrowClassName = "",
  titleClassName = "",
  textClassName = "",
  children,
}) {
  return (
    <Element className={joinClassNames("ui-section-header", className)}>
      {eyebrow && (
        <Eyebrow icon={icon} className={eyebrowClassName}>
          {eyebrow}
        </Eyebrow>
      )}

      <Title
        id={titleId}
        className={joinClassNames("ui-section-title", titleClassName)}
      >
        {title}
      </Title>

      {text != null && (
        <p
          id={textId}
          className={joinClassNames("ui-section-subtitle", textClassName)}
        >
          {text}
        </p>
      )}

      {children}
    </Element>
  );
}
