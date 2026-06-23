import { API_CONFIG } from '../constants';

// ============================================================
// HTTP CLIENT BASE
// ============================================================
const request = async (endpoint, options = {}) => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;

  const config = {
    headers: {
      'Content-Type': 'application/json',
      // Authorization: `Bearer ${token}`, // adicione token aqui se necessário
      ...options.headers,
    },
    ...options,
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

  try {
    const response = await fetch(url, { ...config, signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP Error ${response.status}`);
    }

    return response.json();
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') throw new Error('Tempo de requisição esgotado.');
    throw err;
  }
};

// ============================================================
// COLLECTORS SERVICE — IBL 03: Buscar e Filtrar
// ============================================================
export const collectorsService = {
  /**
   * Busca catadores/centros com filtros (IBL 03)
   * @param {Object} params
   * @param {string}  params.nome           - busca por nome
   * @param {string}  params.filtro_material - tipo de material aceito
   * @param {number}  params.raio_distancia  - raio em km
   * @param {string}  params.ordenar_por     - "maior_preco" | "menor_distancia"
   * @param {number}  params.lat             - latitude do usuário
   * @param {number}  params.lng             - longitude do usuário
   * @param {string}  params.modo            - "vender" | "doar" | "todos"
   * @returns {Promise<Array>}
   */
  search: (params) => {
    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v !== null && v !== undefined))
    ).toString();

    return request(`/collectors/search?${query}`);
  },

  /**
   * Busca detalhes de um catador/centro pelo ID
   */
  getById: (id) => request(`/collectors/${id}`),

  /**
   * Lista materiais aceitos (para popular filtros)
   */
  getMaterials: () => request('/materials'),
};

// ============================================================
// EXPORT DEFAULT (adicione outros serviços aqui)
// ============================================================
export default {
  collectors: collectorsService,
};
