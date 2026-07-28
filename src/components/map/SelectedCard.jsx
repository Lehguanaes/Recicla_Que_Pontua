import "./selectedCard.css";

import { FaStar } from "react-icons/fa";

export default function SelectedCard({
  collector,
  onClose,
  onRequestContact,
  onViewProfile,
}) {
  if (!collector) return null;
console.log(collector);
  return (
    <div className="selected-card">

      {/* Avatar */}
      <div className="selected-avatar">
        {collector.fotoPerfil ? (
          <img
            src={collector.fotoPerfil}
            alt={collector.nome}
            className="selected-avatar-img"
          />
        ) : (
          collector.tipo === "centro"
            ? "🏭"
            : "👤"
        )}

      </div>

      {/* Informações */}
      <div className="selected-content">
        <h3 className="selected-name">
          {collector.nome}
        </h3>
        <div className="selected-subtitle">
          {collector.subtipo}
          <span>
            <FaStar className="selected-star" />
            {collector.rating?.toFixed(1)}
          </span>
        </div>

        {collector.veiculo && (
          <div className="selected-info">
            🚗 {collector.veiculo}
          </div>
        )}

        <div className="selected-info">
          📍 {collector.distancia_km?.toFixed(1)} km
        </div>
        {collector.tipo === "centro" && (
        <div className="selected-address">
           {collector.endereco}
        </div>
      )}

        {collector.materiais?.length > 0 && (
          <div className="selected-materials">
            {collector.materiais.slice(0, 4).map(material => (
              <span
                key={material}
                className="selected-material">
                {material}
              </span>
            ))}
          </div>
        )}

        <div className="selected-actions">
          <button
            className="selected-btn-primary"
            onClick={() => onRequestContact?.(collector)}>
            Solicitar contato
          </button>

          <button
            className="selected-btn-secondary"
            onClick={() => onViewProfile?.(collector)}>
            Ver perfil
          </button>
        </div>
      </div>

      <button
        className="selected-close"
        onClick={onClose}>
        ✕
      </button>
    </div>
  );
}