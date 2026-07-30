import { useEffect } from "react";
import { createPortal } from "react-dom";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaQuestionCircle,
} from "react-icons/fa";
import Button from "../button/Button";
import "./alert.css";

const icons = {
  success: FaCheckCircle,
  danger: FaExclamationTriangle,
  info: FaInfoCircle,
  warning: FaQuestionCircle,
};

export default function Alert({
  isOpen,
  title,
  message,
  children,
  variant = "warning",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
  showCancel = true,
  loading = false,
  className = "",
  confirmIcon = null,
}) {
  useEffect(() => {
    if (!isOpen) return undefined;

    function handleKeyDown(event) {
      if (event.key === "Escape" && !loading) {
        onCancel?.();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, loading, onCancel]);

  if (!isOpen) return null;

  const Icon = icons[variant] || icons.warning;

  return createPortal(
    <div
      className="alert-overlay"
      role="presentation"
      onMouseDown={() => !loading && onCancel?.()}
    >
      <section
        className={`alert-box alert-${variant} ${className}`.trim()}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="alert-title"
        aria-describedby={message ? "alert-message" : undefined}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="alert-icon" aria-hidden="true">
          <Icon />
        </div>

        <h2 id="alert-title">{title}</h2>

        {message && <p id="alert-message">{message}</p>}
        {children && <div className="alert-content">{children}</div>}

        <div className="alert-actions">
          {showCancel && (
            <button
              type="button"
              className="alert-button alert-cancel"
              onClick={onCancel}
              disabled={loading}
            >
              {cancelText}
            </button>
          )}

          <Button
            variant="gradient"
            type="button"
            className="alert-button alert-confirm"
            onClick={onConfirm}
            disabled={loading}
            loading={loading}
            loadingText="Aguarde..."
          >
            {confirmIcon && (
              <span className="alert-button-icon" aria-hidden="true">
                {confirmIcon}
              </span>
            )}
            {confirmText}
          </Button>
        </div>
      </section>
    </div>,
    document.body
  );
}
