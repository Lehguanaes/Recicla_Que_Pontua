export * from './colors';

// ============================================================
// TIPOS DE MATERIAL
// ============================================================
export const MATERIAL_TYPES = [
  { value: '', label: 'Todos os materiais' },
  { value: 'papel', label: 'Papel' },
  { value: 'papelao', label: 'Papelão' },
  { value: 'plastico', label: 'Plástico' },
  { value: 'vidro', label: 'Vidro' },
  { value: 'metal', label: 'Metal' },
  { value: 'eletronico', label: 'Eletrônico' },
  { value: 'oleo', label: 'Óleo de Cozinha' },
];

// ============================================================
// OPÇÕES DE ORDENAÇÃO
// ============================================================
export const SORT_OPTIONS = [
  { value: '', label: 'Relevância' },
  { value: 'maior_preco', label: 'Maior Preço' },
  { value: 'menor_distancia', label: 'Menor Distância' },
];

// ============================================================
// RAIOS DE DISTÂNCIA (km)
// ============================================================
export const DISTANCE_OPTIONS = [
  { value: 1, label: '1 km' },
  { value: 2, label: '2 km' },
  { value: 5, label: '5 km' },
  { value: 10, label: '10 km' },
  { value: 20, label: '20 km' },
  { value: 50, label: '50 km' },
];

// ============================================================
// MODOS DE BUSCA (IBL 03 — Regra de Negócio)
// ============================================================
export const SEARCH_MODES = {
  ALL: 'todos',      // exibe catadores e centros
  SELL: 'vender',    // exibe APENAS centros de coleta
  DONATE: 'doar',    // exibe todos
};

// ============================================================
// TIPOS DE LOCAL
// ============================================================
export const LOCAL_TYPES = {
  COLLECTOR: 'catador',
  CENTER: 'centro',
};

// ============================================================
// CONFIGURAÇÕES DE MAPA
// ============================================================
export const MAP_CONFIG = {
  defaultCenter: { lat: -23.5505, lng: -46.6333 }, // São Paulo
  defaultZoom: 14,
  tileUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: '© OpenStreetMap contributors',
};

// ============================================================
// ENDPOINTS DA API (altere a BASE_URL conforme seu backend)
// ============================================================
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'https://api.reciclaquepontua.org/v1',
  TIMEOUT: 10000,
};