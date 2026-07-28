import React from "react";
import { FaStar, FaUserPlus, FaComments } from "react-icons/fa";
import { COLORS } from "../../constants";
import Button from "../common/Button";

import "./selectedCard.css";

import { LOCAL_TYPES } from "../../constants";

export default function SelectedCard({
  collector,
  onClose,
  onViewProfile,
  onOpenInvite,
  invitation,
  userProfile,
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

      {/* Botão de convites e chat com as regras de negócio */}
      {userProfile !== "coletor-autonomo" && userProfile !== "centro-coleta" && (
        (() => {
          const status = invitation?.status;
          let btnText = "Enviar Convite";
          let btnDisabled = false;
          let btnIcon = <FaUserPlus size={13} />;
          let btnClick = () => onOpenInvite(collector);

          if (status === "pendente") {
            btnText = "Convite enviado";
            btnDisabled = true;
            btnClick = undefined;
          } else if (status === "aceito") {
            btnText = "Chat";
            btnDisabled = false;
            btnIcon = <FaComments size={13} />;
            btnClick = () => {
              // TODO: Implementar chat futuramente
            };
          }

          return (
            <Button
              onClick={btnClick}
              disabled={btnDisabled}
              className="selected-card-button"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                background: COLORS.white,
                color: COLORS.secondary,
                border: "none",
                borderRadius: "20px",
                padding: "10px 20px",
                marginRight: "50px",
                fontWeight: 600,
                fontSize: "14px",
                boxShadow: "0 8px 20px rgba(0,0,0,.18)",
                cursor: btnDisabled ? "not-allowed" : "pointer",
                transition: "all .25s ease",
              }}
            >
              <span
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  background: COLORS.secondary,
                  color: COLORS.white,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {btnIcon}
              </span>
              <span>{btnText}</span>
            </Button>
          );
        })()
      )}

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