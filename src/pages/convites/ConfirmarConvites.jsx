import React from "react";
import { FaUserPlus } from "react-icons/fa";
import "./convite.css";

const ConfirmarConvite = ({
  open,
  collector,
  onClose,
  onConfirm,
}) => {
  if (!open || !collector) return null;

  return (
    <div className="convite-overlay">
      <div className="convite-modal">

        <div className="convite-icone">
          <FaUserPlus size={34} />
        </div>

        <h2 className="convite-titulo">
          Enviar convite
        </h2>

        <p className="convite-subtitulo">
          Deseja realmente solicitar uma conversa com
          <br />
          <strong>{collector.nome}</strong>?
        </p>

        <div className="convite-aviso">
          Você poderá conversar apenas caso o convite seja aceito.
        </div>

        <div className="perfil-modal-acoes">
          <button
            className="perfil-botao-secundario"
            onClick={onClose}
          >
            Cancelar
          </button>

          <button
            className="perfil-botao-primario"
            onClick={onConfirm}
          >
            Enviar convite
          </button>
        </div>

      </div>
    </div>
  );
};

export default ConfirmarConvite;