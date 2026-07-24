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
