import React from "react";
import {
  FaComments,
  FaIndustry,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaStar,
  FaTimes,
  FaUser,
} from "react-icons/fa";
import { LOCAL_TYPES } from "../../constants";
import "./selectedCard.css";
import { PROFILE_IDS } from "../../constants/profiles";

export default function SelectedCard({
  collector,
  onClose,
  onOpenInvite,
  invitation,
  userProfile,
}) {
  if (!collector) return null;

  const isCenter = collector.tipo === LOCAL_TYPES.CENTER;
  const fotoPerfil = collector.fotoPerfil || collector.foto;
  const profileType =
    collector.subtipo || (isCenter ? "Centro de coleta" : "Coletor autônomo");
  const status = invitation?.status;
  const isPending = status === "pendente";
  const isAccepted = status === "aceito";
  const buttonText = isPending
    ? "Convite enviado"
    : isAccepted
      ? "Abrir conversa"
      : "Enviar convite";
  const ButtonIcon = isAccepted ? FaComments : FaPaperPlane;

  const handleAction = () => {
    if (isPending) return;
    if (isAccepted) {
      // TODO: Implementar chat futuramente.
      return;
    }
    onOpenInvite(collector);
  };

  return (
    <div
      className={`selected-card-container ${
        isCenter ? "is-center" : "is-collector"
      }`}
    >
      <div className="selected-card-content">
        <div className={`selected-card-avatar ${fotoPerfil ? "has-photo" : ""}`}>
          {fotoPerfil ? (
            <img
              src={fotoPerfil}
              alt={collector.nome}
              className="selected-card-avatar-img"
            />
          ) : (
            <span className="selected-card-avatar-icon">
              {isCenter ? <FaIndustry /> : <FaUser />}
            </span>
          )}
        </div>

        <div className="selected-info">
          <div className="selected-card-heading">
            <h3 className="selected-name">{collector.nome}</h3>
            <span className="selected-type-tag">{profileType}</span>
          </div>

          <div className="selected-meta">
            {typeof collector.rating === "number" && (
              <span>
                <FaStar className="selected-star" />
                {collector.rating.toFixed(1)}
              </span>
            )}

            <span>
              <FaMapMarkerAlt />
              {typeof collector.distancia_km === "number"
                ? `${collector.distancia_km.toFixed(1)} km de distância`
                : "Distância não disponível"}
            </span>
          </div>
        </div>
      </div>

      {userProfile !== PROFILE_IDS.COLLECTOR &&
        userProfile !== PROFILE_IDS.CENTER && (
        <button
          type="button"
          onClick={handleAction}
          disabled={isPending}
          className={`selected-card-button ${isAccepted ? "is-chat" : ""}`}
        >
          <ButtonIcon />
          <span>{buttonText}</span>
        </button>
      )}

      <button
        type="button"
        className="selected-close"
        onClick={onClose}
        aria-label="Fechar detalhes do local"
      >
        <FaTimes />
      </button>
    </div>
  );
}
