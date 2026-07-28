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
  aplicarDeslocamentoPrivacidade,
  calcularDistanciaKm,
  extrairCep,
  geocodificarEndereco,
  geocodificarPorCep,
  geocodificarTexto,
  montarEnderecoTexto,
  reverseGeocodificar,
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
  endereco_busca: "",
  filtro_material: "",
  materiais_cadastrados: [],
  raio_distancia: '',
  ordenar_por: "",
  modo: "todos",
};

const AVISO_SEM_LOCAL = "Insira seu local na barra de busca.";
const AVISO_ENDERECO_NAO_ENCONTRADO =
  "Não encontramos esse endereço. Tente incluir rua, bairro e cidade.";
const AVISO_GEOLOCALIZACAO_INDISPONIVEL =
  "Seu navegador não permite obter a localização atual.";
const AVISO_GEOLOCALIZACAO_NEGADA =
  "Não foi possível acessar sua localização. Verifique a permissão do navegador.";

/**
 * Busca catadores autônomos e centros de coleta cadastrados no Firestore
 * (coleção "usuarios"), calculando a distância real até o usuário logado a
 * partir do CEP/endereço de cada um (geocodificado via ViaCEP + Nominatim).
 *
 * A origem da busca (de onde a distância é calculada) pode ser:
 *  - o endereço/CEP cadastrado no perfil do usuário (padrão); ou
 *  - um endereço temporário digitado na barra de busca ("seu local"), que
 *    tem prioridade sobre o cadastrado enquanto estiver preenchido.
 *
 * Mantém a mesma interface que a versão mockada (mockData.js), então os
 * componentes visuais (CollectorCard, CollectorMap, FilterPanel,
 * SelectedCard) não precisam mudar.
 *
 * @param {string|null} uidParam 
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
  const [enderecoCompleto, setEnderecoCompleto] = useState(null);
  const [localTemporario, setLocalTemporario] = useState(null); // { lat, lng, enderecoFormatado }
  const [buscandoLocal, setBuscandoLocal] = useState(false);
  const [avisoLocal, setAvisoLocal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 
  useEffect(() => {
    setFilters((prev) => ({ ...prev, ...filtrosIniciais }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filtrosIniciais)]);

  const obterLocalizacaoUsuario = useCallback(async () => {
    if (!uid) return { coords: null, enderecoTexto: null };

    const snapUsuario = await getDoc(doc(db, "usuarios", uid));
    if (!snapUsuario.exists()) return { coords: null, enderecoTexto: null };

    const dadosUsuario = snapUsuario.data();
    const endereco = dadosUsuario.endereco || {};
    const cidade = endereco.cidade || dadosUsuario.cidade;
    const estado = endereco.estado || dadosUsuario.estado;
    const enderecoTexto = montarEnderecoTexto({
      rua: endereco.rua,
      bairro: endereco.bairro,
      cidade,
      estado,
    });

    if (
      typeof dadosUsuario.latitude === "number" &&
      typeof dadosUsuario.longitude === "number"
    ) {
      return {
        coords: { lat: dadosUsuario.latitude, lng: dadosUsuario.longitude },
        enderecoTexto,
      };
    }

    const cep = extrairCep(dadosUsuario);

    let coordenadas = cep ? await geocodificarPorCep(cep) : null;
    if (!coordenadas && Object.keys(endereco).length > 0) {
      await aguardar(300);
      coordenadas = await geocodificarEndereco({ ...endereco, cep });
    }

    if (!coordenadas && (cidade || estado)) {
      await aguardar(300);
      coordenadas = await geocodificarEndereco({ cidade, estado });
    }

    if (!coordenadas) return { coords: null, enderecoTexto };

    // Cache: evita geocodificar o mesmo usuário toda vez que ele abrir a tela
    updateDoc(doc(db, "usuarios", uid), {
      latitude: coordenadas.lat,
      longitude: coordenadas.lng,
    }).catch((err) =>
      console.error("Não foi possível salvar a localização em cache:", err)
    );

    return { coords: coordenadas, enderecoTexto };
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
      const cep = extrairCep(coletor);
      const cidade = endereco.cidade || coletor.cidade;
      const estado = endereco.estado || coletor.estado;

      let coordenadas = cep ? await geocodificarPorCep(cep) : null;
      let chamadaNominatimFeita = Boolean(cep);

      if (!coordenadas && Object.keys(endereco).length > 0) {
        if (chamadaNominatimFeita) await aguardar(300);
        coordenadas = await geocodificarEndereco({ ...endereco, cep });
        chamadaNominatimFeita = true;
      }

      if (!coordenadas && (cidade || estado)) {
        if (chamadaNominatimFeita) await aguardar(300);
        coordenadas = await geocodificarEndereco({ cidade, estado });
        chamadaNominatimFeita = true;
      }

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

      if (chamadaNominatimFeita) await aguardar(300);
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

      setUserLocation(localizacaoUsuario.coords);
      setEnderecoCompleto(localizacaoUsuario.enderecoTexto);

      const listaFormatada = listaColetores.map((coletor) => {
        const infoTipo = INFO_POR_PERFIL[coletor.perfil] || {};
        const ehCatadorAutonomo = coletor.perfil === "coletor-autonomo";
        const lat = coletor.latitude;
        const lng = coletor.longitude;
        const temCoordenadas = typeof lat === "number" && typeof lng === "number";

        // Catadores autônomos (endereço residencial) são exibidos no mapa em
        // uma posição aproximada (deslocada ~40-150m, sempre igual para o
        // mesmo catador), para não expor o endereço exato. Centros de coleta
        // (endereço comercial, aberto ao público) usam a coordenada real.
        const coordenadasExibicao =
          ehCatadorAutonomo && temCoordenadas
            ? aplicarDeslocamentoPrivacidade(lat, lng, coletor.id)
            : { lat, lng };

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
          lat: typeof coordenadasExibicao.lat === "number" ? coordenadasExibicao.lat : null,
          lng: typeof coordenadasExibicao.lng === "number" ? coordenadasExibicao.lng : null,
          // Usado pelo card/mapa pra indicar "localização aproximada".
          localizacaoAproximada: ehCatadorAutonomo && temCoordenadas,
          materiais: coletor.materiaisAceitos || [],
          fotoPerfil: coletor.fotoPerfil || null,
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

  // Origem efetiva da busca: o endereço temporário digitado ("seu local")
  // tem prioridade sobre o endereço/CEP cadastrado no perfil. A distância é
  // recalculada aqui (não precisa geocodificar os coletores de novo) sempre
  // que a origem mudar.
  const origem = localTemporario || userLocation;

  // Enquanto os dados carregam pela primeira vez ainda não sabemos se falta
  // local; só mostramos o aviso depois que o carregamento inicial terminou.
  useEffect(() => {
    if (loading) return;
    if (!origem && !buscandoLocal) {
      setAvisoLocal((atual) => atual || AVISO_SEM_LOCAL);
    } else if (origem) {
      setAvisoLocal((atual) => (atual === AVISO_SEM_LOCAL ? null : atual));
    }
  }, [loading, origem, buscandoLocal]);

  // Dispara a busca por um endereço digitado na barra ("seu local"). Se o
  // campo estiver vazio, volta a usar o endereço cadastrado (ou mostra o
  // aviso, caso o usuário também não tenha CEP cadastrado).
  const buscarPorLocal = useCallback(async () => {
    const texto = filters.endereco_busca?.trim();

    if (!texto) {
      setLocalTemporario(null);
      setAvisoLocal(userLocation ? null : AVISO_SEM_LOCAL);
      return;
    }

    setBuscandoLocal(true);
    setAvisoLocal(null);

    const coordenadas = await geocodificarTexto(texto);

    setBuscandoLocal(false);

    if (!coordenadas) {
      setLocalTemporario(null);
      setAvisoLocal(AVISO_ENDERECO_NAO_ENCONTRADO);
      return;
    }

    setLocalTemporario(coordenadas);
  }, [filters.endereco_busca, userLocation]);

  // Usa o GPS do navegador (opção "Minha localização atual" na barra de
  // busca) em vez de um endereço digitado. Já converte as coordenadas em
  // texto (reverse geocoding) só para exibir/preencher o campo — a origem
  // da busca usa as coordenadas diretas, sem precisar geocodificar de volta.
  const buscarPorLocalizacaoAtual = useCallback(() => {
    if (!navigator.geolocation) {
      setAvisoLocal(AVISO_GEOLOCALIZACAO_INDISPONIVEL);
      return;
    }

    setBuscandoLocal(true);
    setAvisoLocal(null);

    navigator.geolocation.getCurrentPosition(
      async (posicao) => {
        const { latitude, longitude } = posicao.coords;
        const enderecoTexto = await reverseGeocodificar(latitude, longitude);

        setLocalTemporario({
          lat: latitude,
          lng: longitude,
          enderecoFormatado: enderecoTexto || "Localização atual",
        });
        setFilters((prev) => ({
          ...prev,
          endereco_busca: enderecoTexto || "Localização atual",
        }));
        setBuscandoLocal(false);
      },
      () => {
        setBuscandoLocal(false);
        setAvisoLocal(AVISO_GEOLOCALIZACAO_NEGADA);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  //volta a usar o endereço cadastrado.
  const limparLocalTemporario = useCallback(() => {
    setLocalTemporario(null);
    setFilters((prev) => ({ ...prev, endereco_busca: "" }));
  }, []);

  
  const results = useMemo(() => {
    let lista = collectors.map((c) => ({
      ...c,
      distancia_km:
        origem && typeof c.lat === "number" && typeof c.lng === "number"
          ? calcularDistanciaKm(origem.lat, origem.lng, c.lat, c.lng)
          : null,
    }));

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
  }, [collectors, filters, origem]);

  const updateFilter = useCallback((campo, valor) => {
    setFilters((prev) => ({ ...prev, [campo]: valor }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ ...FILTROS_INICIAIS, ...filtrosIniciais });
    setLocalTemporario(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const search = useCallback(() => {
    buscarPorLocal();
  }, [buscarPorLocal]);

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
    enderecoCompleto,
    origem,
    localTemporario,
    buscandoLocal,
    avisoLocal,
    updateFilter,
    resetFilters,
    search,
    buscarPorLocal,
    buscarPorLocalizacaoAtual,
    limparLocalTemporario,
    selectCollector,
  };
}
