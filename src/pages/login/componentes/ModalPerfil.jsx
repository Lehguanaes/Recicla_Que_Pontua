import Modal from "../../../components/modal/Modal";
import SelecionarUser from "../../../components/cadastro/selecionarUser/SelecionarUser";
import "./modalPerfil.css";

export default function ModalPerfil({ 
  isOpen,
  perfilSelecionado, 
  onSelect, 
  onConfirm,
  onClose, 
  }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>

      <SelecionarUser
        selected={perfilSelecionado}
        onSelect={onSelect}
      />

      <div className="modal-perfil-actions">
        <button
          className="btn-confirm"
          disabled={!perfilSelecionado}
          onClick={onConfirm}
        >
          Continuar 
        </button>
      </div>

    </Modal>
  );
}
