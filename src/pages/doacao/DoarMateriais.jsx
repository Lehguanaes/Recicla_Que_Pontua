import React, { useState } from "react";
import {
  FaFilter,
  FaListUl,
  FaMapMarkedAlt,
  FaRecycle,
} from "react-icons/fa";
import PetLimparFiltro from "../../assets/PetLimparFiltro.png";
import useCollectorSearch from "../../hooks/useCollectorSearch";
import SearchBar from "../../components/common/SearchBar";
import FilterPanel from "../../components/filters/FilterPanel";
import CollectorMap from "../../components/map/CollectorMap";
import CollectorCard from "../../components/cards/CollectorCard";
import SelectedCard from "../../components/map/SelectedCard";
import Navbar from "../../components/navbar/Navbar";
import Rodape from "../../components/rodape/Rodape";
import "./doarMateriais.css";

const DoarMateriais = () => {
  const [view, setView] = useState("mapa");
  const [showFilters, setShowFilters] = useState(false);

  const {
    filters,
    results,
    selected,
    loading,
    error,
    updateFilter,
    resetFilters,
    search,
    selectCollector,
  } = useCollectorSearch();

  const activeFilterCount = [
    filters.nome,
    filters.filtro_material,
    filters.ordenar_por,
    filters.raio_distancia !== 10 ? filters.raio_distancia : "",
    filters.modo !== "todos" ? filters.modo : "",
  ].filter(Boolean).length;

  const renderResultList = (compact = false) => (
    <div
      className={
        compact ? "donation-results-list compact" : "donation-results-list"
      }
    >
      {results.length === 0 && !loading ? (
        <div className="donation-empty">
          <button
            type="button"
            className="donation-empty-image-button"
            onClick={resetFilters}
            aria-label="Limpar filtros"
          >
            <img
              src={PetLimparFiltro}
              alt=""
              className="donation-empty-image"
            />
          </button>

          <strong>Nenhum resultado encontrado.</strong>

          <span>
            Tente ajustar os filtros ou ampliar o raio de distância.
          </span>

        </div>
      ) : (
        results.map((collector) => (
          <CollectorCard
            key={collector.id}
            collector={collector}
            compact={compact}
            onClick={(col) => {
              selectCollector(col);
              setView("mapa");
            }}
          />
        ))
      )}
    </div>
  );

  return (
    <>
      <Navbar />

      <main className="donation-page">
        <section className="donation-hero">
          <div className="donation-hero-text">
            <span className="donation-kicker">
              <FaRecycle /> Doação de materiais
            </span>
            <h2>Encontre catadores e centros de coleta perto de você</h2>
            <p>
              Busque por nome, material, distância e intenção para combinar sua
              doação com quem pode receber ou coletar.
            </p>
          </div>

          <div className="donation-search-panel">
            <SearchBar
              value={filters.nome}
              onChange={(value) => updateFilter("nome", value)}
              onSearch={search}
              placeholder="Buscar catador, centro ou cooperativa"
            />

            <div className="donation-toolbar">
              <div className="donation-tabs" aria-label="Alternar visualização">
                <button
                  type="button"
                  className={view === "mapa" ? "active" : ""}
                  onClick={() => setView("mapa")}
                >
                  <FaMapMarkedAlt /> Mapa
                </button>
                <button
                  type="button"
                  className={view === "lista" ? "active" : ""}
                  onClick={() => setView("lista")}
                >
                  <FaListUl /> Lista
                </button>
              </div>

              <button
                type="button"
                className="donation-filter-button"
                onClick={() => setShowFilters(true)}
              >
                <FaFilter />
                Filtros
                {activeFilterCount > 0 && <span>{activeFilterCount}</span>}
              </button>
            </div>
          </div>
        </section>

        <section className="donation-content">
          {loading && <div className="donation-loading">Buscando locais...</div>}

          {error && <div className="donation-error">{error}</div>}

          {view === "mapa" ? (
            <div className="donation-map-layout">
              <div className="donation-map-card">
                <div className="donation-map-header">
                  <div>
                    <span>Mapa de coleta</span>
                    <strong>{results.length} locais encontrados</strong>
                  </div>
                </div>

                <div className="donation-map-frame">
                  <CollectorMap
                    collectors={results}
                    selected={selected}
                    onSelectCollector={selectCollector}
                  />
                  {selected && (
                    <SelectedCard
                      collector={selected}
                      onClose={() => selectCollector(null)}
                    />
                  )}
                </div>
              </div>

              <aside className="donation-results-panel">
                <div className="donation-results-heading">
                  <span>Resultados</span>
                  <strong>{results.length}</strong>
                </div>
                {renderResultList(true)}
              </aside>
            </div>
          ) : (
            <div className="donation-list-card">
              <div className="donation-results-heading">
                <span>Locais encontrados</span>
                <strong>{results.length}</strong>
              </div>
              {renderResultList()}
            </div>
          )}

          {showFilters && (
            <FilterPanel
              filters={filters}
              onUpdateFilter={updateFilter}
              onReset={resetFilters}
              onClose={() => setShowFilters(false)}
            />
          )}
        </section>
      </main>

      <Rodape />
    </>
  );
};

export default DoarMateriais;
