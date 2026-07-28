import "./collectorCard.css";

import { FaStar } from "react-icons/fa";
import { COLORS, LOCAL_TYPES, MATERIAL_TYPES } from "../../constants";

function Badge({ children, color = COLORS.orange }) {
  return (
    <span
      className="collector-badge"
      style={{
        color,
        background: `${color}22`,
        borderColor: `${color}44`,
      }}
    >
      {children}
    </span>
  );
}

export default function CollectorCard({ collector, onClick, compact = false }) {
  if (!collector) return null;

  const isCenter = collector.tipo === LOCAL_TYPES.CENTER;
  const typeColor = isCenter ? COLORS.info : COLORS.primary;

  return (
    <div
      className={`collector-card ${compact ? "compact" : ""}`}
      onClick={() => onClick?.(collector)}
    >
      <div
        className="collector-avatar"
        style={{
          background: collector.fotoPerfil ? "transparent" : `${typeColor}22`,
        }}
      >
        {collector.fotoPerfil ? (
          <img
            src={collector.fotoPerfil}
            alt={collector.nome}
            className="collector-avatar-img"
          />
        ) : isCenter ? (
          "🏭"
        ) : (
          "👤"
        )}
      </div>

      <div className="collector-content">
        <div className="collector-header">
          <span className="collector-name">{collector.nome}</span>
          <Badge color={typeColor}>{collector.subtipo}</Badge>
        </div>

        <div className="collector-info">
          <span>
            <FaStar className="collector-star" />
            {collector.rating?.toFixed(1)}
          </span>
          <span>📍 {collector.distancia_km?.toFixed(1)} km</span>
          {collector.veiculo && <span>🚗 {collector.veiculo}</span>}
        </div>

        {!compact && collector.materiais?.length > 0 && (
          <div className="collector-materials">
            {collector.materiais.slice(0, 4).map((material) => (
              <Badge key={material} color={COLORS.secondary}>
                {MATERIAL_TYPES.find((item) => item.value === material)?.label ||
                  material}
              </Badge>
            ))}

            {collector.materiais.length > 4 && (
              <Badge color={COLORS.textSecondary}>
                +{collector.materiais.length - 4}
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
