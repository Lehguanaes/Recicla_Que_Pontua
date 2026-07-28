import "./modal.css";

export default function Modal({ isOpen, onClose, children, className = "" }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`modal-box${className ? ` ${className}` : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Fechar modal"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}
