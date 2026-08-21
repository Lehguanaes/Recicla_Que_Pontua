import React, { useMemo, useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaFilter,
  FaListUl,
  FaMapMarkedAlt,
  FaRecycle,
} from "react-icons/fa";
import PetAviso from "../../assets/PetAviso.png";
import PetConvite from "../../assets/PetConvite.png";
import PetLimparFiltro from "../../assets/PetLimparFiltro.png";
import useCollectorSearch from "../../hooks/useCollectorSearch";
import SearchBar from "../../components/common/SearchBar";
import FilterPanel from "../../components/filters/FilterPanel";
import CollectorMap from "../../components/map/CollectorMap";
import CollectorCard from "../../components/cards/CollectorCard";
import SelectedCard from "../../components/map/SelectedCard";
import ConfirmarConvite from "../convites/ConfirmarConvites";
import Alert from "../../components/alert/Alert";
import FormMessage from "../../components/form/FormMessage";
import PageLayout from "../../components/layout/PageLayout";
import PublicProfileModal from "../../components/profile/PublicProfileModal";
import { PageHeader } from "../../components/typography/Typography";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../services/Firebase";
import { startDirectExchange } from "../../services/chatService";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import "./doarMateriais.css";

// Nem todo coletor/centro tem endereço geocodificável (CEP inválido,
// endereço incompleto, falha na consulta externa etc). Esses ainda aparecem
// na lista, mas não podem ser desenhados no mapa (o Leaflet quebra se
// receber lat/lng nulos).
const temCoordenadasValidas = (collector) =>
  typeof collector?.lat === "number" &&
  typeof collector?.lng === "number" &&
  !Number.isNaN(collector.lat) &&
  !Number.isNaN(collector.lng);

const DoarMateriais = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const registeredMaterials = useMemo(
    () => location.state?.registeredMaterials || [],
    [location.state]
  );
  const registeredMaterialValues = useMemo(
    () => registeredMaterials.map((material) => material.value),
    [registeredMaterials]
  );
  const initialFilters = useMemo(
    () => ({ materiais_cadastrados: registeredMaterialValues }),
    [registeredMaterialValues]
  );
  const [view, setView] = useState("mapa");
  const [showFilters, setShowFilters] = useState(false);
  const [openInvite, setOpenInvite] = useState(false);
  const [selectedInvite, setSelectedInvite] = useState(null);
  const [sendingInvite, setSendingInvite] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState(null);
  const [openingDirectChat, setOpeningDirectChat] = useState(false);
  const [directChatError, setDirectChatError] = useState("");
  const [profilePreview, setProfilePreview] = useState(null);
  const mapFocusRef = useRef(null);

  const { user } = useAuth();
  const [sentInvitations, setSentInvitations] = useState([]);

  useEffect(() => {
    if (!user?.uid) return;
    const q = query(
      collection(db, "convites"),
      where("remetenteId", "==", user.uid)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() });
      });
      setSentInvitations(list);
    }, (err) => {
      console.error("Erro ao assinar convites:", err);
    });
    return unsubscribe;
  }, [user?.uid]);

  const {
    filters,
    results,
    selected,
    loading,
    error,
    origem,
    bairroUsuario,
    cidadeUsuario,
    localTemporario,
    buscandoLocal,
    avisoLocal,
    updateFilter,
    resetFilters,
    search,
    limparLocalTemporario,
    selectCollector,
  } = useCollectorSearch(null, initialFilters);

  const invitation = useMemo(() => {
    if (!selected || !sentInvitations.length) return null;
    return sentInvitations.find((inv) => inv.destinatarioId === selected.id);
  }, [selected, sentInvitations]);

  const activeFilterCount = [
    filters.nome,
    filters.ordenar_por,
    filters.raio_distancia !== 10 ? filters.raio_distancia : "",
    filters.modo !== "todos" ? filters.modo : "",
  ].filter(Boolean).length;

  // O mapa só pode receber quem tem coordenadas válidas; a lista continua
  // mostrando todo mundo (com "distância não disponível" quando for o caso).
  const mapCollectors = useMemo(
    () => results.filter(temCoordenadasValidas),
    [results]
  );
  const semLocalizacaoCount = results.length - mapCollectors.length;
  const selectedForMap = temCoordenadasValidas(selected) ? selected : null;

  useEffect(() => {
    if (!selected || view !== "mapa") return undefined;

    const animationFrame = window.requestAnimationFrame(() => {
      const mapSection = mapFocusRef.current;
      if (!mapSection) return;

      const targetTop =
        window.scrollY + mapSection.getBoundingClientRect().top - 96;
      window.scrollTo({
        top: Math.max(0, targetTop),
        behavior: "smooth",
      });
    });

    return () => window.cancelAnimationFrame(animationFrame);
  }, [selected, view]);

  const renderRegisteredMaterialTags = () =>
    registeredMaterials.length > 0 && (
      <div className="donation-material-tags" aria-label="Materiais cadastrados">
        <div className="donation-material-summary">
          <span className="donation-material-summary-icon" aria-hidden="true">
            <FaRecycle />
          </span>
          <div>
            <strong>Materiais selecionados</strong>
            <small>Esta seleção está filtrando os locais apresentados.</small>
          </div>
        </div>

        <div className="donation-material-list">
          {registeredMaterials.map((material) => (
            <span className="donation-material-item" key={material.value}>
              <strong>
                {material.quantity} {material.unit}
              </strong>
              <span>{material.label}</span>
            </span>
          ))}
        </div>
      </div>
    );

  const renderResultList = (compact = false) => (
    <div
      className={
        compact ? "donation-results-list compact" : "donation-results-list"
      }
    >
      {results.length === 0 && !loading ? (
        <div className="donation-empty">
          <button
            type="button"
            className="donation-empty-image-button"
            onClick={resetFilters}
            aria-label="Limpar filtros"
          >
            <img
              src={PetLimparFiltro}
              alt=""
              className="donation-empty-image pet-floating"
            />
          </button>

          <strong>Nenhum resultado encontrado.</strong>

          <span>
            Ajuste os filtros ou amplie o raio de distância.
          </span>

        </div>
      ) : (
        results.map((collector) => (
          <CollectorCard
            key={collector.id}
            collector={collector}
            compact={compact}
            onClick={(col) => {
              selectCollector(col);
              setView("mapa");
            }}
          />
        ))
      )}
    </div>
  );

  const getExchangeMaterials = () =>
    registeredMaterials.map((material) => ({
      value: material.value,
      label: material.label,
      quantity: Number(material.quantity) || 0,
      unit: material.unit || "un",
    }));

  const handleConfirmInvite = async () => {
    if (!user?.uid || !selectedInvite || sendingInvite) return;
    const inviteReceiver = selectedInvite;
    const existingInv = sentInvitations.find(
      (inv) => inv.destinatarioId === inviteReceiver.id
    );
    const invitationMaterials = getExchangeMaterials();
    setSendingInvite(true);
    try {
      if (existingInv) {
        const docRef = doc(db, "convites", existingInv.id);
        await updateDoc(docRef, {
          status: "pendente",
          createdAt: serverTimestamp(),
          respondedAt: null,
          solicitacaoId: `${existingInv.id}-${Date.now()}`,
          materiais: invitationMaterials,
        });
      } else {
        const newDocRef = doc(collection(db, "convites"));
        await setDoc(newDocRef, {
          conviteId: newDocRef.id,
          remetenteId: user.uid,
          destinatarioId: inviteReceiver.id,
          status: "pendente",
          createdAt: serverTimestamp(),
          respondedAt: null,
          solicitacaoId: newDocRef.id,
          materiais: invitationMaterials,
        });
      }
      setOpenInvite(false);
      setInviteSuccess(inviteReceiver);
    } catch (error) {
      console.error("Erro ao enviar convite:", error);
    } finally {
      setSendingInvite(false);
    }
  };

  const handleOpenDirectChat = async (collector) => {
    if (!user?.uid || !collector?.id || openingDirectChat) return;

    setOpeningDirectChat(true);
    setDirectChatError("");
    try {
      const chatId = await startDirectExchange({
        senderId: user.uid,
        recipientId: collector.id,
        materials: getExchangeMaterials(),
      });
      navigate("/chat", { state: { chatId } });
    } catch (error) {
      console.error("Erro ao iniciar troca direta:", error);
      setDirectChatError(
        error.code === "chat/direct-access-not-allowed"
          ? "Este perfil ainda exige um convite para iniciar uma nova troca."
          : "Não foi possível abrir uma nova troca agora. Tente novamente."
      );
    } finally {
      setOpeningDirectChat(false);
    }
  };

  const handleReviewMaterials = () => {
    setOpenInvite(false);
    navigate("/doacao/cadastrar-materiais", {
      state: { registeredMaterials },
    });
  };

  const handleInviteSuccessConfirm = () => {
    setInviteSuccess(null);
    navigate("/convites");
  };

  return (
    <>
      <PageLayout>

      <main className="donation-page">
        <section className="donation-hero">
          <PageHeader
            as="div"
            className="donation-hero-text"
            eyebrowClassName="donation-kicker"
            eyebrow="Reciclagem de materiais"
            icon={<FaRecycle />}
            title="Encontre coletores e centros de coleta perto de você!"
            text={
              registeredMaterials.length > 0
                ? "Sua busca já está filtrada pelos materiais cadastrados. Agora, escolha quem pode recebê-los ou coletá-los."
                : "Busque por nome, material, distância e intenção para combinar sua doação com quem pode receber ou coletar."
            }
          />

          <div className="donation-hero-guide">
            <div className="donation-guide-bubble">
              <span className="donation-guide-label">
                Próximo passo
              </span>
              <p>
                Escolha com quem compartilhar seus materiais e envie um convite
                ou inicie uma nova troca pelo chat!
              </p>
            </div>
            <img
              src={PetAviso}
              alt="Mascote apresentando uma orientação"
              className="donation-guide-pet pet-floating"
            />
          </div>
        </section>

        <section className="donation-content">
          <div className="donation-search-panel">
            <SearchBar
              value={filters.endereco_busca}
              onChange={(valor) => updateFilter("endereco_busca", valor)}
              onSearch={search}
              bairroUsuario={bairroUsuario}
              cidadeUsuario={cidadeUsuario}
              onClear={limparLocalTemporario}
              loading={buscandoLocal}
              aviso={avisoLocal}
              localAtivo={Boolean(localTemporario)}
              placeholder="Bairro ou cidade"
            />
            {localTemporario?.enderecoFormatado && (
              <small className="donation-local-ativo">
                Buscando perto de: {localTemporario.enderecoFormatado}
              </small>
            )}

            <div className="donation-toolbar">
              <div className="donation-tabs" aria-label="Alternar visualização">
                <button
                  type="button"
                  className={view === "mapa" ? "active" : ""}
                  onClick={() => setView("mapa")}
                >
                  <FaMapMarkedAlt /> Mapa
                </button>
                <button
                  type="button"
                  className={view === "lista" ? "active" : ""}
                  onClick={() => setView("lista")}
                >
                  <FaListUl /> Lista
                </button>
              </div>

              <button
                type="button"
                className="donation-filter-button"
                onClick={() => setShowFilters(true)}
              >
                <FaFilter />
                Filtros
                {activeFilterCount > 0 && <span>{activeFilterCount}</span>}
              </button>
            </div>
          </div>

          {loading && <div className="donation-loading">Buscando locais...</div>}

          <FormMessage as="div" className="donation-error">
            {error}
          </FormMessage>

          {renderRegisteredMaterialTags()}

          {view === "mapa" ? (
            <div className="donation-map-layout" ref={mapFocusRef}>
              <div className="donation-map-card">
                <div className="donation-map-header">
                  <div>
                    <span>Mapa de coleta</span>
                    <strong>
                      {results.length} {results.length === 1 ? "local encontrado" : "locais encontrados"}
                    </strong>
                    {semLocalizacaoCount > 0 && (
                      <small className="donation-map-aviso">
                        {semLocalizacaoCount}{" "}
                        {semLocalizacaoCount === 1
                          ? "local sem localização no mapa"
                          : "locais sem localização no mapa"}
                      </small>
                    )}
                  </div>
                </div>

                <div className="donation-map-frame">
                  <CollectorMap
                    collectors={mapCollectors}
                    selected={selectedForMap}
                    onSelectCollector={selectCollector}
                    origin={origem}
                  />
                  {selected && (
                    <SelectedCard
                      collector={selected}
                      onClose={() => selectCollector(null)}
                      onViewProfile={setProfilePreview}
                      onOpenInvite={(collector) => {
                        setSelectedInvite(collector);
                        setOpenInvite(true);
                      }}
                      onOpenChat={handleOpenDirectChat}
                      invitation={invitation}
                      userProfile={user?.perfil}
                      directChatLoading={openingDirectChat}
                    />
                  )}
                </div>
              </div>

              <aside className="donation-results-panel">
                <div className="donation-results-heading">
                  <span>Resultados</span>
                  <strong>{results.length}</strong>
                </div>
                {renderResultList(true)}
              </aside>
            </div>
          ) : (
            <div className="donation-list-card">
              <div className="donation-results-heading">
                <span>Locais encontrados</span>
                <strong>{results.length}</strong>
              </div>
              {renderResultList()}
            </div>
          )}

          {showFilters && (
            <FilterPanel
              filters={filters}
              onUpdateFilter={updateFilter}
              onReset={resetFilters}
              onClose={() => setShowFilters(false)}
            />
          )}
        </section>
      </main>

      <ConfirmarConvite
        open={openInvite}
        collector={selectedInvite}
        onClose={() => setOpenInvite(false)}
        onConfirm={handleConfirmInvite}
        loading={sendingInvite}
        materials={registeredMaterials}
        onReviewMaterials={handleReviewMaterials}
      />

      <Alert
        isOpen={Boolean(inviteSuccess)}
        title="Convite enviado!"
        message={
          inviteSuccess
            ? `Seu convite para ${inviteSuccess.nome} foi enviado com sucesso.`
            : ""
        }
        variant="success"
        confirmText="Entendi"
        showCancel={false}
        onConfirm={handleInviteSuccessConfirm}
        onCancel={() => setInviteSuccess(null)}
        className="donation-invite-success-alert"
      >
        <div className="donation-invite-success-content">
          <img
            src={PetConvite}
            alt="Mascote comemorando o envio do convite"
            className="donation-invite-success-pet pet-floating"
          />
          <div>
            <strong>Agora é só acompanhar!</strong>
            <p>
              Fique de olho nas notificações. Avisaremos quando o convite for
              respondido e a conversa estiver disponível.
            </p>
          </div>
        </div>
      </Alert>

      <Alert
        isOpen={Boolean(directChatError)}
        title="Não foi possível abrir o chat"
        message={directChatError}
        variant="warning"
        confirmText="Entendi"
        showCancel={false}
        onConfirm={() => setDirectChatError("")}
        onCancel={() => setDirectChatError("")}
      />

      <PublicProfileModal
        isOpen={Boolean(profilePreview)}
        profile={profilePreview}
        onClose={() => setProfilePreview(null)}
      />

      </PageLayout>
    </>
  );
};

export default DoarMateriais;
