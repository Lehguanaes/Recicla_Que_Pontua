import { FaLock } from "react-icons/fa";

export default function LockedAction({
  icon,
  label,
  count,
  onClick = () => {},
}) {
  return (
    <button
      type="button"
      className="comunidade-locked-action"
      onClick={onClick}
      aria-label={label}
    >
      <span className="comunidade-locked-action-icon">
        {icon}
      </span>

      {count !== undefined && (
        <span className="comunidade-locked-action-count">{count}</span>
      )}

      <FaLock className="comunidade-locked-action-lock" />
    </button>
  );
}