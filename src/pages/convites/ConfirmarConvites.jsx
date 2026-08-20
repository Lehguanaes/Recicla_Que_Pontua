import React from "react";
import { FaEdit, FaPaperPlane, FaRecycle } from "react-icons/fa";
import Alert from "../../components/alert/Alert";
import CollectorCard from "../../components/cards/CollectorCard";
import Button from "../../components/button/Button";
import "./convite.css";

const ConfirmarConvite = ({
  open,
  collector,
  onClose,
  onConfirm,
  loading = false,
  materials = [],
  onReviewMaterials,
}) => {
  if (!open || !collector) return null;

  const hasMaterials = materials.length > 0;

  return (
    <Alert
      isOpen={open}
      title="Enviar convite para iniciar a troca?"
      message="Confira o perfil e os materiais desta solicitação antes de continuar."
      variant="warning"
      confirmText="Enviar convite"
      cancelText="Cancelar"
      onConfirm={onConfirm}
      onCancel={onClose}
      loading={loading}
      className="convite-alert-box"
      confirmIcon={<FaPaperPlane />}
    >
      <section className="convite-alert-section">
        <span className="convite-alert-label">Perfil selecionado</span>
        <CollectorCard collector={collector} compact />
      </section>

      <section className="convite-alert-section convite-material-section">
        <div className="convite-material-heading">
          <div>
            <FaRecycle aria-hidden="true" />
            <span className="convite-alert-label">
              Materiais para esta troca
            </span>
          </div>
          {hasMaterials && <strong>{materials.length}</strong>}
        </div>

        {hasMaterials ? (
          <ul className="convite-material-list">
            {materials.map((material) => (
              <li key={material.value}>
                <strong>{material.label}</strong>
                <span>
                  {material.quantity} {material.unit}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="convite-material-empty">
            Nenhum material foi informado para esta solicitação.
          </p>
        )}

        <Button
          variant="neutral"
          type="button"
          className="convite-review-button"
          onClick={onReviewMaterials}
          disabled={loading}
        >
          <FaEdit aria-hidden="true" />
          {hasMaterials ? "Revisar escolhas" : "Escolher materiais"}
        </Button>
      </section>

      <p className="convite-alert-note">
        A conversa será liberada depois que o perfil aceitar o convite. Os
        detalhes da troca serão combinados pelo chat.
      </p>
    </Alert>
  );
};

export default ConfirmarConvite;
