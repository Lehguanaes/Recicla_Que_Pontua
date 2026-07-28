// ============================================================
// GEOCODIFICAÇÃO — CEP/endereço -> coordenadas (lat/lng)
// ============================================================
// Usa o ViaCEP (já usado no cadastro de endereço) para normalizar o CEP em
// endereço, e o Nominatim/OpenStreetMap (gratuito) para converter esse
// endereço em coordenadas.
//
// Atenção: o Nominatim tem política de uso que pede no máximo ~1 requisição
// por segundo e não recomenda uso em massa/produção de alto volume — para
// escalar, o ideal é migrar para a Google Geocoding API (paga, mas com um
// nível gratuito) através de um endpoint de backend, evitando expor a chave
// no front-end.

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const NOMINATIM_REVERSE_URL = "https://nominatim.openstreetmap.org/reverse";

/**
 * Busca o endereço correspondente a um CEP usando o ViaCEP.
 * Retorna null se o CEP for inválido ou não encontrado.
 */
export async function buscarEnderecoPorCep(cep) {
  const cepLimpo = (cep || "").replace(/\D/g, "");
  if (cepLimpo.length !== 8) return null;

  try {
    const resposta = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
    const dados = await resposta.json();

    if (dados.erro) return null;

    return {
      rua: dados.logradouro,
      bairro: dados.bairro,
      cidade: dados.localidade,
      estado: dados.uf,
      cep: cepLimpo,
    };
  } catch (err) {
    console.error("Erro ao buscar endereço pelo CEP:", err);
    return null;
  }
}

/**
 * Converte um endereço (rua, bairro, cidade, estado...) em coordenadas
 * lat/lng usando o Nominatim. Retorna null se não encontrar nada.
 */
export async function geocodificarEndereco({
  rua,
  numero,
  bairro,
  cidade,
  estado,
  cep,
} = {}) {
  const partes = [
    rua && numero ? `${rua}, ${numero}` : rua,
    bairro,
    cidade,
    estado,
    cep,
    "Brasil",
  ].filter(Boolean);

  const consulta = partes.join(", ");
  if (!consulta) return null;

  const params = new URLSearchParams({
    format: "json",
    q: consulta,
    countrycodes: "br",
    limit: "1",
  });

  try {
    const resposta = await fetch(`${NOMINATIM_URL}?${params.toString()}`);
    const dados = await resposta.json();

    if (!Array.isArray(dados) || dados.length === 0) return null;

    return {
      lat: parseFloat(dados[0].lat),
      lng: parseFloat(dados[0].lon),
    };
  } catch (err) {
    console.error("Erro ao geocodificar endereço:", err);
    return null;
  }
}

/**
 * Atalho: a partir só do CEP, busca o endereço no ViaCEP e já devolve as
 * coordenadas geocodificadas.
 */
export async function geocodificarPorCep(cep) {
  const endereco = await buscarEnderecoPorCep(cep);
  if (!endereco) return null;
  return geocodificarEndereco(endereco);
}

/**
 * Geocodifica um texto livre digitado pelo usuário na busca (ex: "Avenida
 * Paulista, São Paulo" ou "Rua X, 123, Bairro Y"). Usado pela busca por
 * "seu local", que permite pesquisar por um endereço temporário diferente
 * do cadastrado no perfil.
 */
export async function geocodificarTexto(texto) {
  const consulta = (texto || "").trim();
  if (!consulta) return null;

  const params = new URLSearchParams({
    format: "json",
    q: `${consulta}, Brasil`,
    countrycodes: "br",
    limit: "1",
  });

  try {
    const resposta = await fetch(`${NOMINATIM_URL}?${params.toString()}`);
    const dados = await resposta.json();

    if (!Array.isArray(dados) || dados.length === 0) return null;

    return {
      lat: parseFloat(dados[0].lat),
      lng: parseFloat(dados[0].lon),
      enderecoFormatado: dados[0].display_name,
    };
  } catch (err) {
    console.error("Erro ao geocodificar local digitado:", err);
    return null;
  }
}

/**
 * Converte coordenadas (lat/lng) em um endereço legível usando o reverse
 * geocoding do Nominatim. Usado pela opção "usar minha localização atual"
 * da busca, para mostrar/preencher um texto em vez de só lat/lng.
 * Retorna null se não conseguir converter.
 */
export async function reverseGeocodificar(lat, lng) {
  if (typeof lat !== "number" || typeof lng !== "number") return null;

  const params = new URLSearchParams({
    format: "json",
    lat: String(lat),
    lon: String(lng),
  });

  try {
    const resposta = await fetch(`${NOMINATIM_REVERSE_URL}?${params.toString()}`);
    const dados = await resposta.json();
    return dados?.display_name || null;
  } catch (err) {
    console.error("Erro ao converter coordenadas em endereço:", err);
    return null;
  }
}

/**
 * Junta rua/bairro/cidade/estado num texto único (ignorando os campos
 * vazios). Usado para exibir o endereço cadastrado do usuário na sugestão
 * da barra de busca.
 */
export function montarEnderecoTexto({ rua, bairro, cidade, estado } = {}) {
  const texto = [rua, bairro, cidade, estado].filter(Boolean).join(", ");
  return texto || null;
}

/**
 * Extrai o CEP de um documento de usuário/coletor, aceitando tanto o campo
 * no topo do documento (`cep`) quanto o campo aninhado (`endereco.cep`),
 * já que o endereço costuma ser salvo como objeto (mesmo formato devolvido
 * pelo ViaCEP: { rua, bairro, cidade, estado, cep }).
 */
export function extrairCep(dados) {
  if (!dados) return null;
  return dados.cep || dados.endereco?.cep || null;
}

/**
 * Distância em linha reta (km) entre duas coordenadas — fórmula de
 * Haversine. Retorna null se alguma coordenada for inválida.
 */
export function calcularDistanciaKm(lat1, lng1, lat2, lng2) {
  const valores = [lat1, lng1, lat2, lng2];
  if (valores.some((v) => typeof v !== "number" || Number.isNaN(v))) {
    return null;
  }

  const raioTerraKm = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return raioTerraKm * c;
}

/**
 * Pequena pausa, usada para espaçar as chamadas de geocodificação e
 * respeitar o limite de requisições do Nominatim.
 */
export function aguardar(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Gera um deslocamento pequeno e DETERMINÍSTICO (o mesmo catador sempre cai
 * no mesmo ponto aproximado, em vez de "pular" de lugar a cada busca) a
 * partir das coordenadas reais de um catador autônomo. Usado para não expor
 * o endereço residencial exato no mapa — centros de coleta (endereço
 * comercial, aberto ao público) não passam por essa função.
 *
 * @param {number} lat latitude real
 * @param {number} lng longitude real
 * @param {string} seed valor usado para gerar sempre o mesmo deslocamento
 *   para o mesmo catador (normalmente o id do documento no Firestore)
 * @param {number} raioMetros raio máximo do deslocamento (padrão: 150m)
 */
export function aplicarDeslocamentoPrivacidade(lat, lng, seed, raioMetros = 150) {
  if (typeof lat !== "number" || typeof lng !== "number") return { lat, lng };

  // Hash simples e determinístico a partir do seed.
  let hash = 0;
  const texto = String(seed || "");
  for (let i = 0; i < texto.length; i++) {
    hash = (hash << 5) - hash + texto.charCodeAt(i);
    hash |= 0;
  }

  const anguloBase = (hash % 360) * (Math.PI / 180);
  // Varia a distância entre 40% e 100% do raio máximo (usando outra parte do
  // hash), pra não deixar todo mundo exatamente na borda do círculo.
  const fatorDistancia = 0.4 + Math.abs(hash % 61) / 100; // 0.40–1.00
  const distanciaMetros = raioMetros * fatorDistancia;

  // Converte metros em graus (aproximação válida para deslocamentos pequenos)
  const raioTerraMetros = 6371000;
  const dLat = (distanciaMetros * Math.cos(anguloBase)) / raioTerraMetros;
  const dLng =
    (distanciaMetros * Math.sin(anguloBase)) /
    (raioTerraMetros * Math.cos((lat * Math.PI) / 180));

  return {
    lat: lat + (dLat * 180) / Math.PI,
    lng: lng + (dLng * 180) / Math.PI,
  };
}
