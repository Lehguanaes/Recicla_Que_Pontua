import React from "react";
import { FaTimes } from "react-icons/fa";
import {
  DISTANCE_OPTIONS,
  SEARCH_MODES,
  SORT_OPTIONS,
} from "../../constants";
import SelectField from "../form/SelectField";
import Button from "../button/Button";
import IconButton from "../button/IconButton";
import "./filterPanel.css";

const FilterPanel = ({ filters, onUpdateFilter, onReset, onClose }) => {
  const sortOptions =
    filters.modo === SEARCH_MODES.DONATE
      ? SORT_OPTIONS.filter((option) => option.value !== "maior_preco")
      : SORT_OPTIONS;
  const sortValue = sortOptions.some((option) => option.value === filters.ordenar_por)
    ? filters.ordenar_por
    : "";

  const handleModeChange = (value) => {
    onUpdateFilter("modo", value);
    if (value === SEARCH_MODES.DONATE && filters.ordenar_por === "maior_preco") {
      onUpdateFilter("ordenar_por", "");
    }
  };

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
          <IconButton label="Fechar filtros" onClick={onClose}>
            <FaTimes />
          </IconButton>
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
                  onClick={() => handleModeChange(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {filters.modo === SEARCH_MODES.SELL && (
              <p>O modo “Vender” exibe apenas centros de coleta.</p>
            )}
          </div>

          <SelectField
            native
            className="filter-field"
            label="Raio de distância"
            value={filters.raio_distancia}
            onChange={(value) => onUpdateFilter("raio_distancia", Number(value))}
            options={DISTANCE_OPTIONS}
          />

          <SelectField
            native
            className="filter-field"
            label="Ordenar por"
            value={sortValue}
            onChange={(value) => onUpdateFilter("ordenar_por", value)}
            options={sortOptions}
          />
        </div>

        <footer className="filter-footer">
          <Button
            variant="neutral"
            type="button"
            className="filter-footer-button"
            onClick={onReset}
          >
            Limpar
          </Button>
          <Button
            variant="neutral"
            type="button"
            className="filter-footer-button"
            onClick={onClose}
          >
            Aplicar
          </Button>
        </footer>
      </aside>
    </div>
  );
};

export default FilterPanel;
