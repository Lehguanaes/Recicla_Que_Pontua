import { useEffect, useId, useRef } from "react";
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
  const dialogRef = useRef(null);
  const onCancelRef = useRef(onCancel);
  const titleId = useId();
  const messageId = useId();

  useEffect(() => {
    onCancelRef.current = onCancel;
  }, [onCancel]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousActiveElement = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape" && !loading) {
        onCancelRef.current?.();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousActiveElement?.focus?.();
    };
  }, [isOpen, loading]);

  if (!isOpen) return null;

  const Icon = icons[variant] || icons.warning;

  return createPortal(
    <div
      className="alert-overlay"
      role="presentation"
      onMouseDown={() => !loading && onCancel?.()}
    >
      <section
        ref={dialogRef}
        className={`alert-box alert-${variant} ${className}`.trim()}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={message ? messageId : undefined}
        tabIndex="-1"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="alert-icon" aria-hidden="true">
          <Icon />
        </div>

        <h2 id={titleId}>{title}</h2>

        {message && <p id={messageId}>{message}</p>}
        {children && <div className="alert-content">{children}</div>}

        <div className="alert-actions">
          {showCancel && (
            <Button
              variant="neutral"
              type="button"
              className="alert-button alert-cancel"
              onClick={onCancel}
              disabled={loading}
            >
              {cancelText}
            </Button>
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
