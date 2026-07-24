import { useCallback, useEffect, useMemo, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "../services/Firebase";
import { useAuth } from "../contexts/AuthContext";
import {
  aguardar,
  calcularDistanciaKm,
  geocodificarEndereco,
  geocodificarPorCep,
} from "../utils/Geocoding";

// Perfis que aparecem como resultado de busca na tela de doação
const PERFIS_COLETA = ["coletor-autonomo", "centro-coleta"];

const INFO_POR_PERFIL = {
  "coletor-autonomo": { tipo: "catador", subtipo: "Autônomo" },
  "centro-coleta": { tipo: "centro", subtipo: "Centro de Coleta" },
};

// Rótulos para o tipo de veículo salvo no perfil (ver ModalConfigurarColeta)
const LABEL_TIPO_VEICULO = {
  bicicleta: "Bicicleta",
  moto: "Moto",
  carro: "Carro",
  utilitario: "Utilitário",
  caminhao: "Caminhão",
};

const FILTROS_INICIAIS = {
  nome: "",
  filtro_material: "",
  materiais_cadastrados: [],
  raio_distancia: 10,
  ordenar_por: "",
  modo: "todos",
};

/**
 * Busca catadores autônomos e centros de coleta cadastrados no Firestore
 * (coleção "usuarios"), calculando a distância real até o usuário logado a
 * partir do CEP/endereço de cada um (geocodificado via ViaCEP + Nominatim).
 *
 * Mantém a mesma interface que a versão mockada (mockData.js), então os
 * componentes visuais (CollectorCard, CollectorMap, FilterPanel,
 * SelectedCard) não precisam mudar.
 *
 * @param {string|null} uidParam UID do usuário para calcular a origem da
 *   busca. Se null, usa o usuário autenticado (useAuth).
 * @param {object} filtrosIniciais Filtros iniciais (ex: materiais já
 *   cadastrados pelo usuário antes de vir para essa tela).
 */
export default function useCollectorSearch(uidParam, filtrosIniciais = {}) {
  const { user } = useAuth();
  const uid = uidParam || user?.uid || null;

  const [filters, setFilters] = useState({
    ...FILTROS_INICIAIS,
    ...filtrosIniciais,
  });
  const [collectors, setCollectors] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Reaplica filtros iniciais se eles mudarem (ex: usuário cadastrou
  // materiais novos e voltou para essa tela)
  useEffect(() => {
    setFilters((prev) => ({ ...prev, ...filtrosIniciais }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filtrosIniciais)]);

  // Descobre a localização do usuário logado a partir do CEP já cadastrado
  // no perfil dele. Se o perfil já tiver latitude/longitude em cache, usa
  // direto; senão geocodifica e salva de volta para não repetir a consulta
  // nas próximas vezes.
  const obterLocalizacaoUsuario = useCallback(async () => {
    if (!uid) return null;

    const snapUsuario = await getDoc(doc(db, "usuarios", uid));
    if (!snapUsuario.exists()) return null;

    const dadosUsuario = snapUsuario.data();

    if (
      typeof dadosUsuario.latitude === "number" &&
      typeof dadosUsuario.longitude === "number"
    ) {
      return { lat: dadosUsuario.latitude, lng: dadosUsuario.longitude };
    }

    const endereco = dadosUsuario.endereco || {};
    const cidade = endereco.cidade || dadosUsuario.cidade;
    const estado = endereco.estado || dadosUsuario.estado;

    const coordenadas =
      (dadosUsuario.cep ? await geocodificarPorCep(dadosUsuario.cep) : null) ||
      (cidade || estado ? await geocodificarEndereco({ cidade, estado }) : null);

    if (!coordenadas) return null;

    // Cache: evita geocodificar o mesmo usuário toda vez que ele abrir a tela
    updateDoc(doc(db, "usuarios", uid), {
      latitude: coordenadas.lat,
      longitude: coordenadas.lng,
    }).catch((err) =>
      console.error("Não foi possível salvar a localização em cache:", err)
    );

    return coordenadas;
  }, [uid]);

  // Busca os catadores/centros no Firestore e geocodifica quem ainda não
  // tem coordenadas salvas (uma requisição por vez, para respeitar o limite
  // do Nominatim).
  const buscarColetores = useCallback(async () => {
    const consulta = query(
      collection(db, "usuarios"),
      where("perfil", "in", PERFIS_COLETA)
    );
    const snap = await getDocs(consulta);

    const lista = [];
    snap.forEach((docSnap) => {
      if (docSnap.id === uid) return; // não lista o próprio usuário
      lista.push({ id: docSnap.id, ...docSnap.data() });
    });

    const listaComCoordenadas = [];

    for (const coletor of lista) {
      if (
        typeof coletor.latitude === "number" &&
        typeof coletor.longitude === "number"
      ) {
        listaComCoordenadas.push(coletor);
        continue;
      }

      const endereco = coletor.endereco || {};
      const cidade = endereco.cidade || coletor.cidade;
      const estado = endereco.estado || coletor.estado;

      // Tenta do mais específico pro mais genérico: endereço completo, CEP
      // isolado e, por último, só cidade/estado — assim, mesmo com dados
      // incompletos, dificilmente fica sem nenhuma coordenada.
      const coordenadas =
        (await geocodificarEndereco({ ...endereco, cep: coletor.cep })) ||
        (coletor.cep ? await geocodificarPorCep(coletor.cep) : null) ||
        (cidade || estado ? await geocodificarEndereco({ cidade, estado }) : null);

      if (coordenadas) {
        updateDoc(doc(db, "usuarios", coletor.id), {
          latitude: coordenadas.lat,
          longitude: coordenadas.lng,
        }).catch((err) =>
          console.error("Não foi possível salvar coordenadas em cache:", err)
        );

        listaComCoordenadas.push({
          ...coletor,
          latitude: coordenadas.lat,
          longitude: coordenadas.lng,
        });
      } else {
        listaComCoordenadas.push(coletor);
      }

      // Só pausa quando uma geocodificação de fato aconteceu (respeita o
      // limite de ~1 req/s do Nominatim); quem já tinha cache não espera.
      await aguardar(250);
    }

    return listaComCoordenadas;
  }, [uid]);

  const carregarDados = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [localizacaoUsuario, listaColetores] = await Promise.all([
        obterLocalizacaoUsuario(),
        buscarColetores(),
      ]);

      setUserLocation(localizacaoUsuario);

      const listaFormatada = listaColetores.map((coletor) => {
        const infoTipo = INFO_POR_PERFIL[coletor.perfil] || {};
        const lat = coletor.latitude;
        const lng = coletor.longitude;

        const distancia_km =
          localizacaoUsuario &&
          typeof lat === "number" &&
          typeof lng === "number"
            ? calcularDistanciaKm(
                localizacaoUsuario.lat,
                localizacaoUsuario.lng,
                lat,
                lng
              )
            : null;

        return {
          id: coletor.id,
          nome: coletor.nome || "Sem nome",
          tipo: infoTipo.tipo || "catador",
          subtipo: infoTipo.subtipo || "",
          veiculo: coletor.possuiVeiculo
            ? LABEL_TIPO_VEICULO[coletor.tipoVeiculo] || "Possui veículo"
            : null,
          // Ainda não existe avaliação (rating) nem preço por kg cadastrados
          // no perfil de coletores/centros no Firestore.
          rating: null,
          preco_kg: {},
          distancia_km,
          lat: lat ?? null,
          lng: lng ?? null,
          materiais: coletor.materiaisAceitos || [],
          foto: coletor.fotoPerfil || null,
          telefone: coletor.telefone || null,
          disponivel: Boolean(
            (coletor.materiaisAceitos || []).length > 0 &&
              typeof coletor.possuiVeiculo === "boolean"
          ),
        };
      });

      setCollectors(listaFormatada);
    } catch (err) {
      console.error("Erro ao buscar catadores e centros de coleta:", err);
      setError("Não foi possível carregar os locais de coleta agora.");
    } finally {
      setLoading(false);
    }
  }, [obterLocalizacaoUsuario, buscarColetores]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  // Filtragem e ordenação acontecem em memória, sobre os dados já
  // carregados — igual ao comportamento do mockSearch original.
  const results = useMemo(() => {
    let lista = [...collectors];

    // Regra de negócio: modo "vender" oculta catadores autônomos
    if (filters.modo === "vender") {
      lista = lista.filter((c) => c.tipo === "centro");
    }

    if (filters.nome) {
      const termo = filters.nome.toLowerCase();
      lista = lista.filter((c) => c.nome.toLowerCase().includes(termo));
    }

    const materiaisFiltro =
      filters.materiais_cadastrados?.length > 0
        ? filters.materiais_cadastrados
        : filters.filtro_material
        ? [filters.filtro_material]
        : [];

    if (materiaisFiltro.length > 0) {
      lista = lista.filter((c) =>
        materiaisFiltro.some((material) => c.materiais.includes(material))
      );
    }

    if (filters.raio_distancia) {
      // Quem ainda não tem coordenadas (distancia_km null) continua
      // aparecendo, só não pode ser ordenado por proximidade com certeza.
      lista = lista.filter(
        (c) => c.distancia_km === null || c.distancia_km <= filters.raio_distancia
      );
    }

    if (filters.ordenar_por === "menor_distancia") {
      lista.sort(
        (a, b) => (a.distancia_km ?? Infinity) - (b.distancia_km ?? Infinity)
      );
    }
    // "maior_preco" não é aplicado: preço por kg ainda não é um dado real
    // cadastrado no perfil dos coletores/centros.

    return lista;
  }, [collectors, filters]);

  const updateFilter = useCallback((campo, valor) => {
    setFilters((prev) => ({ ...prev, [campo]: valor }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ ...FILTROS_INICIAIS, ...filtrosIniciais });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // A filtragem já é reativa (useMemo acima). Mantido por compatibilidade
  // com o SearchBar (botão/Enter) — não dispara nova geocodificação.
  const search = useCallback(() => {}, []);

  const selectCollector = useCallback((collector) => {
    setSelected(collector);
  }, []);

  return {
    filters,
    results,
    selected,
    loading,
    error,
    userLocation,
    updateFilter,
    resetFilters,
    search,
    selectCollector,
  };
}
