import React, { useState } from 'react';
import { COLORS, MATERIAL_TYPES, SORT_OPTIONS, DISTANCE_OPTIONS, SEARCH_MODES } from '../../constants';
import Button from '../common/Button';

const SelectField = ({ label, value, onChange, options }) => (
  <div style={{ marginBottom: '16px' }}>
    <label style={{ display: 'block', fontSize: '13px', color: COLORS.textSecondary, marginBottom: '6px', fontWeight: 600 }}>
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: '100%',
        padding: '10px 12px',
        borderRadius: '10px',
        border: `1.5px solid ${COLORS.border}`,
        fontSize: '14px',
        color: COLORS.textPrimary,
        background: COLORS.white,
        appearance: 'none',
        cursor: 'pointer',
      }}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

/**
 * Painel de Filtros — IBL 03
 * Filtros: modo (vender/doar), material, raio, ordenação
 */
const FilterPanel = ({ filters, onUpdateFilter, onReset, onClose }) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        width: '300px',
        background: COLORS.white,
        boxShadow: '-4px 0 20px rgba(0,0,0,0.15)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '16px 0 0 16px',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: COLORS.primary,
          padding: '18px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ color: COLORS.white, fontWeight: 700, fontSize: '16px' }}>🎚️ Filtros</span>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', color: COLORS.white, fontSize: '22px', cursor: 'pointer' }}
        >
          ✕
        </button>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>

        {/* Modo — IBL 03 Regra de Negócio */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '13px', color: COLORS.textSecondary, marginBottom: '8px', fontWeight: 600 }}>
            Intenção
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[
              { value: SEARCH_MODES.ALL, label: 'Todos' },
              { value: SEARCH_MODES.SELL, label: '💰 Vender' },
              { value: SEARCH_MODES.DONATE, label: '♻️ Doar' },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => onUpdateFilter('modo', opt.value)}
                style={{
                  flex: 1,
                  padding: '8px 4px',
                  borderRadius: '8px',
                  border: `2px solid ${filters.modo === opt.value ? COLORS.primary : COLORS.border}`,
                  background: filters.modo === opt.value ? COLORS.primary : COLORS.white,
                  color: filters.modo === opt.value ? COLORS.white : COLORS.textPrimary,
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {filters.modo === SEARCH_MODES.SELL && (
            <p style={{ fontSize: '12px', color: COLORS.textSecondary, marginTop: '6px' }}>
              ℹ️ Modo Vender: exibe apenas centros de coleta.
            </p>
          )}
        </div>

        <SelectField
          label="Tipo de Material"
          value={filters.filtro_material}
          onChange={(v) => onUpdateFilter('filtro_material', v)}
          options={MATERIAL_TYPES}
        />

        <SelectField
          label="Raio de Distância"
          value={filters.raio_distancia}
          onChange={(v) => onUpdateFilter('raio_distancia', Number(v))}
          options={DISTANCE_OPTIONS}
        />

        <SelectField
          label="Ordenar Por"
          value={filters.ordenar_por}
          onChange={(v) => onUpdateFilter('ordenar_por', v)}
          options={SORT_OPTIONS}
        />
      </div>

      {/* Footer */}
      <div style={{ padding: '16px 20px', borderTop: `1px solid ${COLORS.divider}`, display: 'flex', gap: '10px' }}>
        <Button variant="outline" onClick={onReset} fullWidth>
          Limpar
        </Button>
        <Button onClick={onClose} fullWidth>
          Aplicar
        </Button>
      </div>
    </div>
  );
};

export default FilterPanel;
