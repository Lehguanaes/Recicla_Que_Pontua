import Button from "../button/Button";

export default function FormActions({
  className = "",
  cancelClassName = "",
  confirmClassName = "",
  cancelText = "Cancelar",
  confirmText = "Salvar",
  loadingText = "Salvando...",
  loading = false,
  disabled = false,
  onCancel,
  onConfirm,
  confirmType = "submit",
}) {
  return (
    <div className={className}>
      {onCancel && (
        <button
          type="button"
          className={cancelClassName}
          onClick={onCancel}
        >
          {cancelText}
        </button>
      )}

      <Button
        variant="green"
        type={confirmType}
        className={confirmClassName}
        disabled={disabled}
        loading={loading}
        loadingText={loadingText}
        onClick={onConfirm}
      >
        {confirmText}
      </Button>
    </div>
  );
}
