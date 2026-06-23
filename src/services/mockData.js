// ============================================================
// MOCK DATA — para desenvolvimento sem backend
// ============================================================

export const MOCK_COLLECTORS = [
  {
    id: 1,
    nome: 'Fabio',
    tipo: 'catador',
    subtipo: 'Autônomo',
    veiculo: 'Caminhonete',
    rating: 5.0,
    distancia_km: 0.3,
    lat: -23.555,
    lng: -46.620,
    materiais: ['papel', 'papelao', 'metal'],
    preco_kg: { papel: 0.50, papelao: 0.30, metal: 2.00 },
    foto: null,
    telefone: '(11) 99999-0001',
    disponivel: true,
  },
  {
    id: 2,
    nome: 'Centro Verde',
    tipo: 'centro',
    subtipo: 'Centro de Coleta',
    veiculo: null,
    rating: 4.7,
    distancia_km: 1.2,
    lat: -23.548,
    lng: -46.628,
    materiais: ['papel', 'plastico', 'vidro', 'metal', 'eletronico'],
    preco_kg: { papel: 0.60, plastico: 0.80, vidro: 0.20, metal: 2.50, eletronico: 5.00 },
    foto: null,
    telefone: '(11) 3333-4444',
    disponivel: true,
  },
  {
    id: 3,
    nome: 'Cooperativa Recicla SP',
    tipo: 'centro',
    subtipo: 'Cooperativa',
    veiculo: null,
    rating: 4.9,
    distancia_km: 2.5,
    lat: -23.560,
    lng: -46.615,
    materiais: ['papel', 'papelao', 'plastico', 'metal', 'oleo'],
    preco_kg: { papel: 0.70, papelao: 0.40, plastico: 0.90, metal: 2.80, oleo: 1.20 },
    foto: null,
    telefone: '(11) 4444-5555',
    disponivel: true,
  },
  {
    id: 4,
    nome: 'Carlos',
    tipo: 'catador',
    subtipo: 'Autônomo',
    veiculo: 'Carrinho',
    rating: 4.5,
    distancia_km: 0.8,
    lat: -23.553,
    lng: -46.625,
    materiais: ['papel', 'papelao', 'plastico'],
    preco_kg: { papel: 0.40, papelao: 0.25, plastico: 0.60 },
    foto: null,
    telefone: '(11) 99999-0002',
    disponivel: true,
  },
];

/**
 * Simula a busca com filtros (IBL 03)
 */
export const mockSearch = ({ nome = '', filtro_material = '', raio_distancia = 50, ordenar_por = '', modo = 'todos' } = {}) => {
  let results = [...MOCK_COLLECTORS];

  // Regra de Negócio: modo "vender" oculta catadores autônomos
  if (modo === 'vender') {
    results = results.filter((c) => c.tipo === 'centro');
  }

  // Filtro por nome
  if (nome) {
    results = results.filter((c) => c.nome.toLowerCase().includes(nome.toLowerCase()));
  }

  // Filtro por material
  if (filtro_material) {
    results = results.filter((c) => c.materiais.includes(filtro_material));
  }

  // Filtro por raio
  if (raio_distancia) {
    results = results.filter((c) => c.distancia_km <= raio_distancia);
  }

  // Ordenação
  if (ordenar_por === 'menor_distancia') {
    results.sort((a, b) => a.distancia_km - b.distancia_km);
  } else if (ordenar_por === 'maior_preco') {
    const getMaxPrice = (c) => Math.max(...Object.values(c.preco_kg));
    results.sort((a, b) => getMaxPrice(b) - getMaxPrice(a));
  }

  return Promise.resolve(results);
};
