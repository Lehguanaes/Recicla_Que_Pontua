export default function ProfileInfoRow({
  icon,
  label,
  value,
  full = false,
  action,
}) {
  return (
    <div className={`perfil-info-linha${full ? " perfil-info-linha-full" : ""}`}>
      {icon}
      <div className="perfil-info-texto">
        <span className="perfil-info-label">{label}</span>
        <span className="perfil-info-valor">{value}</span>
      </div>
      {action}
    </div>
  );
}
