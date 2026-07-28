import "./selectedCard.css";
import React from "react";
import { FaStar, FaUserPlus } from "react-icons/fa";
import Button from "../common/Button";

export default function SelectedCard({
  collector,
  onClose,
  onViewProfile,
  onOpenInvite,
}) {
  if (!collector) return null;

  return (
    <div className="selected-card-container">
      <div className="selected-card-content">
        {/* Avatar */}
        <div className="selected-avatar">
          {collector.tipo === "centro" ? "🏭" : "👤"}
        </div>

        {/* Informações */}
        <div className="selected-info">
          <div className="selected-name">
            {collector.nome}
          </div>

          <div className="selected-subtitle">
            {collector.subtipo}
            <FaStar className="selected-star" />
            {collector.rating?.toFixed(1)}
          </div>

          {collector.veiculo && (
            <div className="selected-detail">
              🚗 {collector.veiculo}
            </div>
          )}

          <div className="selected-detail">
            📍 {collector.distancia_km?.toFixed(1)} Km
          </div>
        </div>
      </div>
     <div className="selected-actions">
      <button
        className="selected-btn-secondary"
        onClick={() => onViewProfile?.(collector)}
      >
        Ver perfil
      </button>

      <Button
        onClick={() => onOpenInvite(collector)}
        className="selected-card-button"
      >
        <span className="selected-card-button-icon">
          <FaUserPlus size={13} />
        </span>

        <span>Enviar Convite</span>
      </Button>
    </div>
      <button
        className="selected-close"
        onClick={onClose}
      >
        ✕
      </button>
    </div>
  );
}