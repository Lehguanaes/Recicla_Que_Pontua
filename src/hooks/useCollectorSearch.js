import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { normalizeMaterialId } from "../constants";
import { PROFILE_IDS } from "../constants/profiles";

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
} from "../utils/Geocoding";

// Perfis que aparecem como resultado de busca na tela de doação
const PERFIS_COLETA = [PROFILE_IDS.COLLECTOR, PROFILE_IDS.CENTER];

const INFO_POR_PERFIL = {
  [PROFILE_IDS.COLLECTOR]: { tipo: "coletor", subtipo: "Autônomo" },
  [PROFILE_IDS.CENTER]: { tipo: "centro", subtipo: "Centro de Coleta" },
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

const AVISO_SEM_LOCAL = "Digite um bairro ou uma cidade.";
const AVISO_ENDERECO_NAO_ENCONTRADO =
  "Não encontramos esse local. Tente informar o bairro ou a cidade.";

/**
 * Busca coletores autônomos e centros de coleta cadastrados no Firestore
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
  const enderecoUsuario = user?.endereco || {};
  const bairroUsuario = enderecoUsuario.bairro || user?.bairro || "";
  const cidadeUsuarioNome = enderecoUsuario.cidade || user?.cidade || "";
  const estadoUsuario = enderecoUsuario.estado || user?.estado || "";
  const cidadeUsuario = [cidadeUsuarioNome, estadoUsuario]
    .filter(Boolean)
    .join(" - ");
  const cidadePreenchidaRef = useRef(false);

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

  useEffect(() => {
    if (cidadePreenchidaRef.current || !cidadeUsuario) return;

    cidadePreenchidaRef.current = true;
    setFilters((prev) =>
      prev.endereco_busca
        ? prev
        : { ...prev, endereco_busca: cidadeUsuario }
    );
  }, [cidadeUsuario]);

  const obterLocalizacaoUsuario = useCallback(async () => {
    if (!uid) return { coords: null, enderecoTexto: null, favoritos: [] };

    const snapUsuario = await getDoc(doc(db, "usuarios", uid));
    if (!snapUsuario.exists()) {
      return { coords: null, enderecoTexto: null, favoritos: [] };
    }

    const dadosUsuario = snapUsuario.data();
    const favoritos = Array.isArray(dadosUsuario.favoritos)
      ? dadosUsuario.favoritos
      : [];
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
        favoritos,
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

    if (!coordenadas) return { coords: null, enderecoTexto, favoritos };

    // Cache: evita geocodificar o mesmo usuário toda vez que ele abrir a tela
    updateDoc(doc(db, "usuarios", uid), {
      latitude: coordenadas.lat,
      longitude: coordenadas.lng,
    }).catch((err) =>
      console.error("Não foi possível salvar a localização em cache:", err)
    );

    return { coords: coordenadas, enderecoTexto, favoritos };
  }, [uid]);

  // Busca os coletores/centros no Firestore e geocodifica quem ainda não
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
        const ehColetorAutonomo = coletor.perfil === PROFILE_IDS.COLLECTOR;
        const lat = coletor.latitude;
        const lng = coletor.longitude;
        const temCoordenadas = typeof lat === "number" && typeof lng === "number";

        // Coletores autônomos (endereço residencial) são exibidos no mapa em
        // uma posição aproximada (deslocada ~40-150m, sempre igual para o
        // mesmo coletor), para não expor o endereço exato. Centros de coleta
        // (endereço comercial, aberto ao público) usam a coordenada real.
        const coordenadasExibicao =
          ehColetorAutonomo && temCoordenadas
            ? aplicarDeslocamentoPrivacidade(lat, lng, coletor.id)
            : { lat, lng };

        return {
          id: coletor.id,
          nome: coletor.nome || "Sem nome",
          tipo: infoTipo.tipo || "coletor",
          subtipo: infoTipo.subtipo || "",
          veiculo: coletor.possuiVeiculo
            ? LABEL_TIPO_VEICULO[coletor.tipoVeiculo] || "Possui veículo"
            : null,
          rating:
            Number(coletor.avaliacaoQuantidade) > 0
              ? Number(coletor.avaliacaoSoma || 0) /
                Number(coletor.avaliacaoQuantidade)
              : null,
          preco_kg: {},
          lat: typeof coordenadasExibicao.lat === "number" ? coordenadasExibicao.lat : null,
          lng: typeof coordenadasExibicao.lng === "number" ? coordenadasExibicao.lng : null,
          // Usado pelo card/mapa pra indicar "localização aproximada".
          localizacaoAproximada: ehColetorAutonomo && temCoordenadas,
          materiais: (coletor.materiaisAceitos || []).map(normalizeMaterialId),
          fotoPerfil: coletor.fotoPerfil || null,
          favorito: (localizacaoUsuario.favoritos || []).includes(coletor.id),
          acessoDireto: (coletor.acessosDiretosChat || []).includes(uid),
          telefone: coletor.telefone || null,
          disponivel: Boolean(
            (coletor.materiaisAceitos || []).length > 0 &&
              typeof coletor.possuiVeiculo === "boolean"
          ),
        };
      });

      setCollectors(listaFormatada);
    } catch (err) {
      console.error("Erro ao buscar coletores e centros de coleta:", err);
      setError("Não foi possível carregar os locais de coleta agora.");
    } finally {
      setLoading(false);
    }
  }, [obterLocalizacaoUsuario, buscarColetores, uid]);

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

    // Regra de negócio: modo "vender" oculta coletores autônomos
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

    lista.sort((a, b) => {
      if (a.favorito !== b.favorito) return a.favorito ? -1 : 1;
      if (filters.ordenar_por === "menor_distancia") {
        return (a.distancia_km ?? Infinity) - (b.distancia_km ?? Infinity);
      }
      return 0;
    });
    // "maior_preco" não é aplicado: preço por kg ainda não é um dado real
    // cadastrado no perfil dos coletores/centros.

    return lista;
  }, [collectors, filters, origem]);

  const updateFilter = useCallback((campo, valor) => {
    setFilters((prev) => ({ ...prev, [campo]: valor }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      ...FILTROS_INICIAIS,
      ...filtrosIniciais,
      endereco_busca: cidadeUsuario,
    });
    setLocalTemporario(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cidadeUsuario]);

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
    bairroUsuario,
    cidadeUsuario,
    origem,
    localTemporario,
    buscandoLocal,
    avisoLocal,
    updateFilter,
    resetFilters,
    search,
    buscarPorLocal,
    limparLocalTemporario,
    selectCollector,
  };
}
