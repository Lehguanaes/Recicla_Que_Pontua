import React from "react";
import { FaStar, FaUserPlus } from "react-icons/fa";

import Button from "../common/Button";
import "./selectedCard.css";

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
        <div className="selected-avatar">
          {collector.tipo === "centro" ? "🏭" : "👤"}
        </div>

        <div className="selected-info">
          <div className="selected-name">{collector.nome}</div>

          <div className="selected-subtitle">
            {collector.subtipo}
            <FaStar className="selected-star" />
            {collector.rating?.toFixed(1)}
          </div>

          <div className="selected-distance">
            📍 {collector.distancia_km?.toFixed(1)} km de distância
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
        onClick={() => onOpenInvite?.(collector)}>
          <FaUserPlus />
          Enviar convite
        </Button>
      </div>

      <button
        type="button"
        className="selected-close"
        onClick={onClose}
        aria-label="Fechar detalhes do local"
      >
        ✕
      </button>
    </div>
  );
}
