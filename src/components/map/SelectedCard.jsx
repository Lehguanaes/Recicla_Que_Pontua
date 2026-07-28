import React from "react";
import { FaStar, FaUserPlus } from "react-icons/fa";
import { COLORS } from "../../constants";
import Button from "../common/Button";

// Card de destaque exibido sobre o mapa quando um local é selecionado
const SelectedCard = ({
  collector,
  onClose,
  onOpenInvite,
}) => {
  if (!collector) return null;

  return (
    <div
      className="selected-card-container"
      style={{
      position: "absolute",
      bottom: "60px",
      left: "50%",
      transform: "translateX(-50%)",

      width: "80%",
      maxWidth: "850px",

      background: COLORS.secondary,
      borderRadius: "16px",
      padding: "16px",
      boxShadow: "0 8px 24px var(--color-rgba-0-0-0-0p25)",
      zIndex: 500,
      display: "flex",
      gap: "12px",
      alignItems: "center",
      color: COLORS.white,
    }}
    >
      <div
        className="selected-card-content"
        style={{
          display: "flex",
          gap: "12px",
          alignItems: "center",
          flex: 1,
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            background: "var(--color-rgba-255-255-255-0p25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "26px",
            flexShrink: 0,
          }}
        >
          {collector.tipo === "centro" ? "🏭" : "👤"}
        </div>

        {/* Informações */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontWeight: 700,
              fontSize: "17px",
              marginBottom: "2px",
            }}
          >
            {collector.nome}
          </div>

          <div
            style={{
              fontSize: "13px",
              opacity: 0.9,
              marginBottom: "4px",
            }}
          >
            {collector.subtipo}{" "}
            <FaStar style={{ color: "gold", marginLeft: 4 }} />{" "}
            {collector.rating?.toFixed(1)}
          </div>

          {collector.veiculo && (
            <div
              style={{
                fontSize: "13px",
                opacity: 0.85,
              }}
            >
              🚗 {collector.veiculo}
            </div>
          )}

          <div
            style={{
              fontSize: "13px",
              opacity: 0.85,
            }}
          >
            📍 {collector.distancia_km?.toFixed(1)} Km
          </div>
        </div>
      </div>

      {/* Botão */}
<Button
  onClick={() => onOpenInvite(collector)}
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
    cursor: "pointer",
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
    <FaUserPlus size={13} />
  </span>

  <span>Enviar Convite</span>
</Button>

      {/* Botão fechar */}
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: "10px",
          right: "12px",
          background: "var(--color-rgba-255-255-255-0p3)",
          border: "none",
          color: COLORS.white,
          width: "26px",
          height: "26px",
          borderRadius: "50%",
          fontSize: "14px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
        }}
      >
        ✕
      </button>
    </div>
  );
};

export default SelectedCard;