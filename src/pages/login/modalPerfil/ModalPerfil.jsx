import { useEffect, useState } from "react";
import Modal from "../../../components/modal/Modal";
import Alert from "../../../components/alert/Alert";
import Button from "../../../components/button/Button";
import SelecionarUser from "../../../components/cadastro/selecionarUser/SelecionarUser";
import { PROFILE_TYPES } from "../../../constants/profiles";
import "./modalPerfil.css";

export default function ModalPerfil({ 
  isOpen,
  perfilSelecionado, 
  onSelect, 
  onConfirm,
  onClose, 
  }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const perfil = PROFILE_TYPES[perfilSelecionado];

  useEffect(() => {
    if (!isOpen) setConfirmOpen(false);
  }, [isOpen]);

  function handleConfirm() {
    setConfirmOpen(false);
    onConfirm();
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="modal-perfil-box"
    >

      <SelecionarUser
        selected={perfilSelecionado}
        onSelect={onSelect}
      />

      <div className="modal-perfil-actions">
        <Button
          variant="gradient"
          className="btn-confirm"
          disabled={!perfilSelecionado}
          onClick={() => setConfirmOpen(true)}
        >
          Continuar 
        </Button>
      </div>

      <Alert
        isOpen={confirmOpen}
        title="Confirmar tipo de perfil?"
        message={`Você selecionou “${perfil?.label || "perfil não informado"}”. Os campos do cadastro serão personalizados para esse perfil.`}
        variant="info"
        confirmText="Usar este perfil"
        cancelText="Revisar escolha"
        onConfirm={handleConfirm}
        onCancel={() => setConfirmOpen(false)}
      />

    </Modal>
  );
}
