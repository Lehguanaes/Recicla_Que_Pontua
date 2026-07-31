import "./collectorCard.css";

import {
  FaCar,
  FaIndustry,
  FaMapMarkerAlt,
  FaStar,
  FaUser,
} from "react-icons/fa";
import { getMaterialLabel, LOCAL_TYPES } from "../../constants";

function Badge({ children, tone = "material" }) {
  return <span className={`collector-badge is-${tone}`}>{children}</span>;
}

export default function CollectorCard({ collector, onClick, compact = false }) {
  if (!collector) return null;

  const isCenter = collector.tipo === LOCAL_TYPES.CENTER;
  const isInteractive = typeof onClick === "function";

  const handleSelect = () => onClick?.(collector);

  return (
    <div
      className={`collector-card ${compact ? "compact" : ""} ${
        isCenter ? "is-center" : "is-collector"
      } ${isInteractive ? "" : "is-static"}`}
      onClick={isInteractive ? handleSelect : undefined}
      onKeyDown={
        isInteractive
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                handleSelect();
              }
            }
          : undefined
      }
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      aria-label={
        isInteractive ? `Ver detalhes de ${collector.nome}` : undefined
      }
    >
      <div className={`collector-avatar ${collector.fotoPerfil ? "has-photo" : ""}`}>
        {collector.fotoPerfil ? (
          <img
            src={collector.fotoPerfil}
            alt={collector.nome}
            className="collector-avatar-img"
          />
        ) : isCenter ? (
          <FaIndustry />
        ) : (
          <FaUser />
        )}
      </div>

      <div className="collector-content">
        <div className="collector-header">
          <span className="collector-name">{collector.nome}</span>
          <Badge tone={isCenter ? "center" : "collector"}>
            {collector.subtipo ||
              (isCenter ? "Centro de coleta" : "Coletor autônomo")}
          </Badge>
        </div>

        <div className="collector-info">
          {typeof collector.rating === "number" && (
            <span>
              <FaStar className="collector-star" />
              {collector.rating.toFixed(1)}
            </span>
          )}

          <span>
            <FaMapMarkerAlt />
            {typeof collector.distancia_km === "number"
              ? `${collector.distancia_km.toFixed(1)} km`
              : "Distância indisponível"}
          </span>

          {collector.veiculo && (
            <span>
              <FaCar />
              {collector.veiculo}
            </span>
          )}
        </div>

        {!compact && collector.materiais?.length > 0 && (
          <div className="collector-materials">
            {collector.materiais.slice(0, 4).map((material) => (
              <Badge key={material}>
                {getMaterialLabel(material)}
              </Badge>
            ))}

            {collector.materiais.length > 4 && (
              <Badge tone="more">+{collector.materiais.length - 4}</Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
