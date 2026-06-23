import React from 'react';
import { COLORS, LOCAL_TYPES } from '../../constants';

const Badge = ({ children, color = COLORS.primary }) => (
  <span
    style={{
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: '20px',
      fontSize: '11px',
      fontWeight: 600,
      background: color + '22',
      color: color,
      border: `1px solid ${color}44`,
    }}
  >
    {children}
  </span>
);

/**
 * Card de Catador/Centro (exibido no mapa e na lista)
 */
const CollectorCard = ({ collector, onClick, compact = false }) => {
  if (!collector) return null;

  const isCenter = collector.tipo === LOCAL_TYPES.CENTER;
  const typeColor = isCenter ? COLORS.info : COLORS.primary;

  return (
    <div
      onClick={() => onClick?.(collector)}
      style={{
        background: COLORS.white,
        borderRadius: '16px',
        padding: compact ? '12px 14px' : '16px',
        boxShadow: `0 4px 16px ${COLORS.cardShadow}`,
        cursor: 'pointer',
        display: 'flex',
        gap: '12px',
        alignItems: 'flex-start',
        transition: 'transform 0.15s, box-shadow 0.15s',
        border: `1px solid ${COLORS.border}`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = `0 8px 24px ${COLORS.cardShadow}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = `0 4px 16px ${COLORS.cardShadow}`;
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: typeColor + '22',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '22px',
          flexShrink: 0,
        }}
      >
        {isCenter ? '🏭' : '👤'}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
          <span style={{ fontWeight: 700, fontSize: '15px', color: COLORS.textPrimary }}>{collector.nome}</span>
          <Badge color={typeColor}>{collector.subtipo}</Badge>
        </div>

        <div style={{ display: 'flex', gap: '12px', fontSize: '13px', color: COLORS.textSecondary, marginBottom: '6px' }}>
          <span>❤️ {collector.rating?.toFixed(1)}</span>
          <span>📍 {collector.distancia_km?.toFixed(1)} km</span>
          {collector.veiculo && <span>🚗 {collector.veiculo}</span>}
        </div>

        {!compact && collector.materiais?.length > 0 && (
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {collector.materiais.slice(0, 4).map((m) => (
              <Badge key={m} color={COLORS.secondary}>{m}</Badge>
            ))}
            {collector.materiais.length > 4 && (
              <Badge color={COLORS.textSecondary}>+{collector.materiais.length - 4}</Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectorCard;