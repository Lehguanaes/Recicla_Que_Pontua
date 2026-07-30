export default function ModalHeader({
  title,
  subtitle,
  titleClassName = "",
  subtitleClassName = "",
}) {
  return (
    <>
      <h2 className={titleClassName}>{title}</h2>
      {subtitle && <p className={subtitleClassName}>{subtitle}</p>}
    </>
  );
}
