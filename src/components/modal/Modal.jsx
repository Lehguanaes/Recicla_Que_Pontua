import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import IconButton from "../button/IconButton";
import "./modal.css";

export default function Modal({
  isOpen,
  onClose,
  children,
  className = "",
  ariaLabel = "Janela de edição",
  showClose = true,
  closeOnBackdrop = true,
  closeOnEscape = true,
}) {
  const dialogRef = useRef(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousActiveElement = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape" && closeOnEscape) onCloseRef.current?.();
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousActiveElement?.focus?.();
    };
  }, [closeOnEscape, isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="modal-overlay"
      role="presentation"
      onMouseDown={() => closeOnBackdrop && onClose?.()}
    >
      <div
        ref={dialogRef}
        className={`modal-box${className ? ` ${className}` : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        tabIndex="-1"
        onMouseDown={(event) => event.stopPropagation()}
      >
        {showClose && (
          <IconButton
            className="modal-close"
            onClick={onClose}
            label="Fechar modal"
          >
            ✕
          </IconButton>
        )}
        {children}
      </div>
    </div>,
    document.body
  );
}
