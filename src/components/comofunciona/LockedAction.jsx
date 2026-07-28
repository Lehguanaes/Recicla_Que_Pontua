import { FaLock } from "react-icons/fa";

export default function LockedAction({icon,label,count,
onClick = () => {},
}) {
  return (
    <div> 
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

    <style>{`  
    .comunidade-locked-action {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 10px;
      border-radius: 999px;
      border: 1px solid rgb(var(--rgb-brand-green) / 0.2);
      background: var(--color-surface-card);
      color: var(--color-text-secondary);
      font-size: 0.82rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s ease, border-color 0.2s ease;
    }
    
    .comunidade-locked-action:hover {
      background: rgb(var(--rgb-brand-green) / 0.08);
      border-color: rgb(var(--rgb-brand-green) / 0.35);
    }
    
    .comunidade-locked-action-icon {
      display: inline-flex;
      align-items: center;
      font-size: 0.95rem;
      color: var(--color-brand-green-dark, var(--color-brand-green-deep));
    }
    
    .comunidade-locked-action-count {
      font-variant-numeric: tabular-nums;
    }
    
    .comunidade-locked-action-lock {
      font-size: 0.7rem;
      opacity: 0.55;
      margin-left: 2px;
    }
    
    `}
    </style>
</div>
  );
}