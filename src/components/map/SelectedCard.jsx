import React from 'react';
import {
  FaStar,
} from "react-icons/fa";

import { COLORS } from '../../constants';

// Card de destaque exibido sobre o mapa quando um catador é selecionado
const SelectedCard = ({ collector, onClose }) => {
  if (!collector) return null;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '60px',
        left: '16px',
        right: '16px',
        background: COLORS.secondary,
        borderRadius: '16px',
        padding: '16px',
        boxShadow: '0 8px 24px var(--color-rgba-0-0-0-0p25)',
        zIndex: 500,
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
        color: COLORS.white,
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: '50%',
          background: 'var(--color-rgba-255-255-255-0p25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '26px',
          flexShrink: 0,
        }}
      >
        {collector.tipo === 'centro' ? '🏭' : '👤'}
      </div>

      {/* Info */}
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: '17px', marginBottom: '2px' }}>{collector.nome}</div>
        <div style={{ fontSize: '13px', opacity: 0.9, marginBottom: '4px' }}>
          {collector.subtipo} • <FaStar style={{ color: 'var(--color-keyword-gold)' }} /> {collector.rating?.toFixed(1)}
        </div>
        {collector.veiculo && (
          <div style={{ fontSize: '13px', opacity: 0.85 }}>🚗 {collector.veiculo}</div>
        )}
        <div style={{ fontSize: '13px', opacity: 0.85 }}>📍 {collector.distancia_km?.toFixed(1)} Km</div>
      </div>

      {/* Fechar */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '10px',
          right: '12px',
          background: 'var(--color-rgba-255-255-255-0p3)',
          border: 'none',
          color: COLORS.white,
          width: '26px',
          height: '26px',
          borderRadius: '50%',
          fontSize: '14px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
        }}
      >
        ✕
      </button>
    </div>
  );
};

export default SelectedCard;
