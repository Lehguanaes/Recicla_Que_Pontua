import React from "react";
import { FaTimes } from "react-icons/fa";
import {
  DISTANCE_OPTIONS,
  MATERIAL_TYPES,
  SEARCH_MODES,
  SORT_OPTIONS,
} from "../../constants";
import Button from "../common/Button";
import "./filterPanel.css";

const SelectField = ({ label, value, onChange, options }) => (
  <label className="filter-field">
    <span>{label}</span>
    <select value={value} onChange={(event) => onChange(event.target.value)}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </label>
);

const FilterPanel = ({ filters, onUpdateFilter, onReset, onClose }) => {
  return (
    <div className="filter-overlay" role="presentation" onClick={onClose}>
      <aside
        className="filter-panel"
        aria-label="Filtros de busca"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="filter-header">
          <div>
            <span>Busca de locais</span>
            <strong>Filtros</strong>
          </div>
          <button type="button" aria-label="Fechar filtros" onClick={onClose}>
            <FaTimes />
          </button>
        </header>

        <div className="filter-body">
          <div className="filter-section">
            <span className="filter-label">Intenção</span>
            <div className="filter-segmented">
              {[
                { value: SEARCH_MODES.ALL, label: "Todos" },
                { value: SEARCH_MODES.SELL, label: "Vender" },
                { value: SEARCH_MODES.DONATE, label: "Doar" },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={filters.modo === option.value ? "active" : ""}
                  onClick={() => onUpdateFilter("modo", option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {filters.modo === SEARCH_MODES.SELL && (
              <p>Modo vender exibe apenas centros de coleta.</p>
            )}
          </div>

          <SelectField
            label="Tipo de material"
            value={filters.filtro_material}
            onChange={(value) => onUpdateFilter("filtro_material", value)}
            options={MATERIAL_TYPES}
          />

          <SelectField
            label="Raio de distância"
            value={filters.raio_distancia}
            onChange={(value) => onUpdateFilter("raio_distancia", Number(value))}
            options={DISTANCE_OPTIONS}
          />

          <SelectField
            label="Ordenar por"
            value={filters.ordenar_por}
            onChange={(value) => onUpdateFilter("ordenar_por", value)}
            options={SORT_OPTIONS}
          />
        </div>

        <footer className="filter-footer">
          <Button variant="outline" onClick={onReset} fullWidth>
            Limpar
          </Button>
          <Button onClick={onClose} fullWidth>
            Aplicar
          </Button>
        </footer>
      </aside>
    </div>
  );
};

export default FilterPanel;
