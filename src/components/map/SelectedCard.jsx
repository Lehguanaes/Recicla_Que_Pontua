import React from "react";
import { FaStar, FaUserPlus } from "react-icons/fa";

import Button from "../common/Button";

import "./selectedCard.css";

import { LOCAL_TYPES } from "../../constants";

export default function SelectedCard({
  collector,
  onClose,
  onViewProfile,
  onOpenInvite,
}) {
  if (!collector) return null;

  const isCenter = collector.tipo === LOCAL_TYPES.CENTER;
  const typeColor = isCenter ? "var(--color-info)" : "var(--color-primary)";
  const fotoPerfil = collector.fotoPerfil || collector.foto;

  return (
    <div className="selected-card-container">
      <div className="selected-card-content">

        <div
          className={`collector-avatar ${fotoPerfil ? "has-photo" : ""}`}
          style={{
            "--collector-avatar-color": `${typeColor}22`,
          }}
        >
          {fotoPerfil ? (
            <img
              src={fotoPerfil}
              alt={collector.nome}
              className="collector-avatar-img"
            />
          ) : (
            <span className="collector-avatar-icon">
              {isCenter ? "🏭" : "👤"}
            </span>
          )}
        </div>

        <div className="selected-info">
          <h3 className="selected-name">
            {collector.nome}
          </h3>

          <div className="selected-subtitle">
            <span>{collector.subtipo}</span>

            {collector.rating && (
              <>
                <FaStar className="selected-star" />
                <span>{collector.rating.toFixed(1)}</span>
              </>
            )}
          </div>

          {collector.distancia_km != null && (
            <div className="selected-distance">
              📍 {collector.distancia_km.toFixed(1)} km de distância
            </div>
          )}
        </div>
      </div>

      <div className="selected-actions">
        <button
          className="selected-btn-secondary"
          onClick={() => onViewProfile?.(collector)}
        >
          Ver perfil
        </button>

        <Button onClick={() => onOpenInvite?.(collector)}>
          <FaUserPlus />
          <span>Enviar convite</span>
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