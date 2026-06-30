import { useState, useCallback, useEffect } from 'react';
import { mockSearch } from '../services/mockData';

const DEFAULT_FILTERS = {
  nome: '',
  filtro_material: '',
  materiais_cadastrados: [],
  raio_distancia: 10,
  ordenar_por: '',
  modo: 'todos',
};

const useCollectorSearch = (userLocation = null, initialFilters = {}) => {
  const [filters, setFilters] = useState({ ...DEFAULT_FILTERS, ...initialFilters });
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
    setFilters({ ...DEFAULT_FILTERS, ...initialFilters });
  }, [initialFilters]);

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