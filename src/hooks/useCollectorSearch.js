import { useState, useCallback, useEffect } from 'react';
import { mockSearch } from '../services/mockData';
// import { collectorsService } from '../services/api'; // trocar quando tiver backend

const DEFAULT_FILTERS = {
  nome: '',
  filtro_material: '',
  raio_distancia: 10,
  ordenar_por: '',
  modo: 'todos',
};

/**
 * Hook — IBL 03: Buscar e Filtrar Centros e Catadores
 *
 * Contém:
 * - Estado dos filtros
 * - Lógica de busca (mock ou API real)
 * - Regras de negócio (ex: modo "vender" oculta autônomos)
 */
const useCollectorSearch = (userLocation = null) => {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = useCallback(async (overrideFilters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        ...filters,
        ...overrideFilters,
        ...(userLocation ? { lat: userLocation.lat, lng: userLocation.lng } : {}),
      };

      // Troque mockSearch por collectorsService.search(params) quando tiver backend
      const data = await mockSearch(params);
      setResults(data);
    } catch (err) {
      setError(err.message || 'Erro ao buscar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [filters, userLocation]);

  // Busca automática ao mudar filtros
  useEffect(() => {
    const timer = setTimeout(() => search(), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const selectCollector = useCallback((collector) => {
    setSelected(collector);
  }, []);

  return {
    filters,
    results,
    selected,
    loading,
    error,
    updateFilter,
    resetFilters,
    search,
    selectCollector,
  };
};

export default useCollectorSearch;
