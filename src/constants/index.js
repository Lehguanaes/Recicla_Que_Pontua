export * from './colors';

export const RECYCLABLE_MATERIALS = [
  { value: 'papel', label: 'Papel' },
  { value: 'papelao', label: 'Papelão' },
  { value: 'plastico', label: 'Plástico' },
  { value: 'vidro', label: 'Vidro' },
  { value: 'metal', label: 'Metal' },
  { value: 'eletronico', label: 'Eletrônico' },
  { value: 'oleo', label: 'Óleo de cozinha' },
];

export const MATERIAL_TYPES = [
  { value: '', label: 'Todos os materiais' },
  ...RECYCLABLE_MATERIALS,
];

const MATERIAL_ALIASES = {
  eletronicos: 'eletronico',
  'oleo-cozinha': 'oleo',
};

export function normalizeMaterialId(materialId) {
  return MATERIAL_ALIASES[materialId] || materialId;
}

export function getMaterialLabel(materialId, fallback = materialId) {
  const normalizedId = normalizeMaterialId(materialId);
  return RECYCLABLE_MATERIALS.find(
    (material) => material.value === normalizedId
  )?.label || fallback;
}

export const SORT_OPTIONS = [
  { value: '', label: 'Relevância' },
  { value: 'maior_preco', label: 'Maior preço' },
  { value: 'menor_distancia', label: 'Menor distância' },
];

// ============================================================
// RAIOS DE DISTÂNCIA (km)
// ============================================================
export const DISTANCE_OPTIONS = [
  { value: 1, label: '10 km' },
  { value: 2, label: '20 km' },
  { value: 5, label: '50 km' },
];

// ============================================================
// MODOS DE BUSCA (IBL 03 — Regra de Negócio)
// ============================================================
export const SEARCH_MODES = {
  ALL: 'todos',      // exibe coletores e centros
  SELL: 'vender',    // exibe APENAS centros de coleta
  DONATE: 'doar',    // exibe todos
};

// ============================================================
// TIPOS DE LOCAL
// ============================================================
export const LOCAL_TYPES = {
  COLLECTOR: 'coletor',
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
