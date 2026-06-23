import React, { useState } from 'react';
import { COLORS } from '../constants';
import useCollectorSearch from '../hooks/useCollectorSearch';
import SearchBar from '../components/common/SearchBar';
import FilterPanel from '../components/filters/FilterPanel';
import CollectorMap from '../components/map/CollectorMap';
import CollectorCard from '../components/cards/CollectorCard';
import SelectedCard from '../components/map/SelectedCard';
import Button from '../components/common/Button';

/**
 * Página: IBL 03 — Buscar e Filtrar Centros e Catadores
 */
const BuscarCatadores = () => {
  const [view, setView] = useState('mapa'); // 'mapa' | 'lista'
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
    filters.filtro_material,
    filters.ordenar_por,
    filters.modo !== 'todos' ? filters.modo : '',
  ].filter(Boolean).length;

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: COLORS.background, position: 'relative', fontFamily: 'sans-serif' }}>

      {/* Header roxo */}
      <div style={{ background: COLORS.primary, padding: '14px 16px 0', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          {/* Logo */}
          <span style={{ color: COLORS.white, fontWeight: 800, fontSize: '22px', letterSpacing: '-0.5px' }}>
            <span style={{ color: COLORS.secondary }}>Recicla que Pontua</span>
          </span>
        </div>

        {/* SearchBar */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ flex: 1 }}>
            <SearchBar
              value={filters.nome}
              onChange={(v) => updateFilter('nome', v)}
              onSearch={search}
            />
          </div>
        </div>

        {/* Tabs + Filtro */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {/* Tab Mapa */}
          <button
            onClick={() => setView('mapa')}
            style={{
              padding: '8px 18px',
              borderRadius: '20px',
              border: 'none',
              background: view === 'mapa' ? COLORS.white : 'rgba(255,255,255,0.2)',
              color: view === 'mapa' ? COLORS.primary : COLORS.white,
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            🗺️ Mapa
          </button>

          {/* Tab Lista */}
          <button
            onClick={() => setView('lista')}
            style={{
              padding: '8px 18px',
              borderRadius: '20px',
              border: 'none',
              background: view === 'lista' ? COLORS.white : 'rgba(255,255,255,0.2)',
              color: view === 'lista' ? COLORS.primary : COLORS.white,
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            ☰ Lista
          </button>

          <div style={{ marginLeft: 'auto' }}>
            <button
              onClick={() => setShowFilters(true)}
              style={{
                padding: '8px 14px',
                borderRadius: '20px',
                border: 'none',
                background: activeFilterCount > 0 ? COLORS.secondary : 'rgba(255,255,255,0.2)',
                color: COLORS.white,
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              🎚️ Filtro {activeFilterCount > 0 && `(${activeFilterCount})`}
            </button>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>

        {/* Loading */}
        {loading && (
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(255,255,255,0.7)', zIndex: 800,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '16px', color: COLORS.primary, fontWeight: 600,
          }}>
            🔍 Buscando...
          </div>
        )}

        {/* Erro */}
        {error && (
          <div style={{
            margin: '16px', padding: '14px', borderRadius: '12px',
            background: '#FFEBEE', color: COLORS.error, fontWeight: 600,
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Mapa */}
        {view === 'mapa' && (
          <>
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
            {/* Contador de resultados */}
            <div style={{
              position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)',
              background: COLORS.primary, color: COLORS.white,
              padding: '8px 20px', borderRadius: '20px',
              fontWeight: 700, fontSize: '14px', zIndex: 400,
            }}>
              {results.length}
            </div>
          </>
        )}

        {/* Lista */}
        {view === 'lista' && (
          <div style={{ overflowY: 'auto', height: '100%', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {results.length === 0 && !loading ? (
              <div style={{ textAlign: 'center', color: COLORS.textSecondary, marginTop: '60px' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔍</div>
                <div style={{ fontWeight: 600 }}>Nenhum resultado encontrado.</div>
                <div style={{ fontSize: '13px', marginTop: '6px' }}>Tente ajustar os filtros.</div>
                <Button onClick={resetFilters} variant="outline" style={{ marginTop: '16px' }}>
                  Limpar Filtros
                </Button>
              </div>
            ) : (
              results.map((c) => (
                <CollectorCard
                  key={c.id}
                  collector={c}
                  onClick={(col) => { selectCollector(col); setView('mapa'); }}
                />
              ))
            )}
          </div>
        )}

        {/* Painel de Filtros */}
        {showFilters && (
          <FilterPanel
            filters={filters}
            onUpdateFilter={updateFilter}
            onReset={resetFilters}
            onClose={() => setShowFilters(false)}
          />
        )}
      </div>
    </div>
  );
};

export default BuscarCatadores;
