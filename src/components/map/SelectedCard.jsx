import React from "react";
import { useNavigate } from "react-router-dom";
import { FaStar, FaUserPlus, FaComments } from "react-icons/fa";
import Button from "../button/Button";
import IconButton from "../button/IconButton";

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
  const navigate = useNavigate();
  if (!collector) return null;

  const isCenter = collector.tipo === LOCAL_TYPES.CENTER;
  const avatarColor = isCenter
    ? "var(--color-highlight-info)"
    : "rgb(var(--rgb-brand-green-deep) / 13%)";
  const fotoPerfil = collector.fotoPerfil || collector.foto;

  const canSendInvite =
  userProfile === "pessoa-recicladora" ||
  userProfile === "instituicao-recicladora" ||
  (userProfile === "coletor-autonomo" && isCenter);

  return (
    <div className="selected-card-container">
      <div className="selected-card-content">
        <div
          className={`collector-avatar ${fotoPerfil ? "has-photo" : ""}`}
          style={{
            "--collector-avatar-color": avatarColor,
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
      {canSendInvite && (
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
              navigate("/chat");
            };
          }

          return (
            <Button
              onClick={btnClick}
              disabled={btnDisabled}
              className="selected-card-button"
              style={{
                display: "flex",
                height: "50px",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                background: "var(--color-white)",
                color: "var(--color-brand-green-deep)",
                border: "none",
                borderRadius: "15px",
                marginRight: "50px",
                fontWeight: 600,
                fontSize: "14px",
                boxShadow: "0 8px 20px var(--shadow-color-neutral)",
                cursor: btnDisabled ? "not-allowed" : "pointer",
                transition: "all .25s ease",
              }}
            >
              <span
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  background: "var(--color-brand-green-deep)",
                  color: "var(--color-white)",
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

      <IconButton
        className="selected-close"
        onClick={onClose}
        label="Fechar detalhes do local"
      >
        ✕
      </IconButton>
    </div>
  );
}
