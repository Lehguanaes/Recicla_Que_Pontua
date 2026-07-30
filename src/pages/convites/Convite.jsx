import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../services/Firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import {
  FaUserCircle,
  FaCheck,
  FaTimes,
  FaInbox,
  FaHistory,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaPhoneAlt,
  FaStar,
} from "react-icons/fa";
import Navbar from "../../components/navbar/Navbar";
import Rodape from "../../components/rodape/Rodape";
import { createChatIfNotExists } from "../../services/chatService";
import "./convite.css";

const PERFIL_LABELS = {
  "pessoa-recicladora": "Pessoa Recicladora",
  "instituicao-recicladora": "Instituição Recicladora",
  "coletor-autonomo": "Catador Autônomo",
  "centro-coleta": "Centro de Coleta",
};

export default function Convite() {
  const { user } = useAuth();
  const [invitations, setInvitations] = useState([]);
  const [senders, setSenders] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pendentes"); // "pendentes" | "historico"

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    setLoading(true);
    let receivedList = [];
    let sentList = [];

    const fetchUserProfile = async (uid) => {
      try {
        const userSnap = await getDoc(doc(db, "usuarios", uid));
        if (userSnap.exists()) {
          setSenders((prev) => ({ ...prev, [uid]: userSnap.data() }));
        }
      } catch (err) {
        console.error("Erro ao carregar perfil:", err);
      }
    };

    const combineAndSet = () => {
      const combined = [...receivedList, ...sentList];
      // Deduplicate by ID
      const unique = Array.from(new Map(combined.map((item) => [item.id, item])).values());
      // Sort: most recent first
      unique.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });
      setInvitations(unique);
      setLoading(false);
    };

    // 1. Query for received invitations
    const qReceived = query(
      collection(db, "convites"),
      where("destinatarioId", "==", user.uid)
    );

    const unsubscribeReceived = onSnapshot(
      qReceived,
      (snapshot) => {
        const list = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          list.push({ id: docSnap.id, ...data });
          fetchUserProfile(data.remetenteId);
        });
        receivedList = list;
        combineAndSet();
      },
      (err) => {
        console.error("Erro ao assinar convites recebidos:", err);
        setLoading(false);
      }
    );

    // 2. Query for sent invitations
    const qSent = query(
      collection(db, "convites"),
      where("remetenteId", "==", user.uid)
    );

    const unsubscribeSent = onSnapshot(
      qSent,
      (snapshot) => {
        const list = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          list.push({ id: docSnap.id, ...data });
          fetchUserProfile(data.destinatarioId);
        });
        sentList = list;
        combineAndSet();
      },
      (err) => {
        console.error("Erro ao assinar convites enviados:", err);
        setLoading(false);
      }
    );

    return () => {
      unsubscribeReceived();
      unsubscribeSent();
    };
  }, [user?.uid]);

  const handleAccept = async (invitationId) => {
    try {
      const invitation = invitations.find((inv) => inv.id === invitationId);
      if (!invitation) return;

      const docRef = doc(db, "convites", invitationId);
      await updateDoc(docRef, {
        status: "aceito",
        respondedAt: serverTimestamp(),
      });

      await createChatIfNotExists(invitation.remetenteId, invitation.destinatarioId);
    } catch (err) {
      console.error("Erro ao aceitar convite:", err);
    }
  };

  const handleRefuse = async (invitationId) => {
    try {
      const docRef = doc(db, "convites", invitationId);
      await updateDoc(docRef, {
        status: "recusado",
        respondedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("Erro ao recusar convite:", err);
    }
  };

  // Filter invitations based on active tab
  const filteredInvitations = useMemo(() => {
    if (activeTab === "pendentes") {
      return invitations.filter((inv) => inv.status === "pendente");
    } else {
      return invitations.filter((inv) => inv.status !== "pendente");
    }
  }, [invitations, activeTab]);

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="convites-loading">
          <div className="convites-spinner"></div>
          <p>Carregando solicitações...</p>
        </div>
        <Rodape />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="convites-page">
        <section className="convites-main-section">
          <header className="convites-header">
            <span className="convites-kicker">
              <FaPaperPlane />
              Conexões para reciclar
            </span>
            <h1>Gerencie seus convites</h1>
            <p>
              Gerencie as solicitações de conversa enviadas e recebidas de outros usuários.
            </p>
          </header>

          <div className="convites-container">
          <div className="convites-tabs">
            <button
              type="button"
              className={`convites-tab-btn ${activeTab === "pendentes" ? "active" : ""}`}
              onClick={() => setActiveTab("pendentes")}
            >
              <FaInbox className="tab-icon" />
              <span>Recentes</span>
              {invitations.filter((inv) => inv.status === "pendente").length > 0 && (
                <span className="badge-count">
                  {invitations.filter((inv) => inv.status === "pendente").length}
                </span>
              )}
            </button>
            <button
              type="button"
              className={`convites-tab-btn ${activeTab === "historico" ? "active" : ""}`}
              onClick={() => setActiveTab("historico")}
            >
              <FaHistory className="tab-icon" />
              <span>Histórico</span>
            </button>
          </div>

          {/* Invitation list */}
          <div className="convites-list">
            {filteredInvitations.length === 0 ? (
              <div className="convites-empty">
                <div className="empty-icon-wrapper">
                  {activeTab === "pendentes" ? <FaInbox size={40} /> : <FaHistory size={40} />}
                </div>
                <h3>Nenhum convite encontrado</h3>
                <p>
                  {activeTab === "pendentes"
                    ? "Você não possui nenhuma solicitação de conversa pendente no momento."
                    : "Seu histórico de convites aceitos ou recusados está vazio."}
                </p>
              </div>
            ) : (
              filteredInvitations.map((inv) => {
                const isSentByMe = inv.remetenteId === user.uid;
                const otherUserId = isSentByMe ? inv.destinatarioId : inv.remetenteId;
                const otherUser = senders[otherUserId] || {};
                const labelPerfil = PERFIL_LABELS[otherUser.perfil] || otherUser.perfil || "Usuário";

                return (
                  <div key={inv.id} className={`convite-card ${inv.status}`}>
                    <div className="convite-card-avatar">
                      {otherUser.fotoPerfil ? (
                        <img src={otherUser.fotoPerfil} alt={otherUser.nome} className="avatar-img" />
                      ) : (
                        <FaUserCircle size={56} className="avatar-placeholder" />
                      )}
                    </div>
                    <div className="convite-card-info">
                      <div className="sender-name-wrapper">
                        <h3>{otherUser.nome || "Usuário sem nome"}</h3>
                        <span className="perfil-tag">{labelPerfil}</span>
                      </div>
                      
                      <div className="sender-details">
                        {otherUser.cidade && otherUser.estado && (
                          <p className="detail-item">
                            <FaMapMarkerAlt aria-hidden="true" />
                            {otherUser.cidade} - {otherUser.estado}
                          </p>
                        )}
                        {otherUser.telefone && (
                          <p className="detail-item">
                            <FaPhoneAlt aria-hidden="true" />
                            {otherUser.telefone}
                          </p>
                        )}
                        <p className="detail-item date">
                          {isSentByMe ? "Enviado em: " : "Recebido em: "}{formatDate(inv.createdAt)}
                        </p>
                        {inv.respondedAt && (
                          <p className="detail-item date">
                            Respondido em: {formatDate(inv.respondedAt)}
                          </p>
                        )}
                      </div>
                    </div>

                    {inv.status === "pendente" ? (
                      isSentByMe ? (
                        <div className="convite-card-status">
                          <span className="status-label pending-sent">
                            Pendente
                          </span>
                        </div>
                      ) : (
                        <div className="convite-card-actions">
                          <button
                            className="action-btn accept-btn"
                            onClick={() => handleAccept(inv.id)}
                            aria-label="Aceitar convite"
                          >
                            <FaCheck />
                            <span>Aceitar</span>
                          </button>
                          <button
                            className="action-btn refuse-btn"
                            onClick={() => handleRefuse(inv.id)}
                            aria-label="Recusar convite"
                          >
                            <FaTimes />
                            <span>Recusar</span>
                          </button>
                        </div>
                      )
                    ) : (
                      <div className="convite-card-status">
                        {inv.status === "aceito" ? (
                          <>
                            <span className="status-label accepted">
                              <FaCheck /> Aceito
                            </span>
                            <Link
                              to="/avaliacao"
                              state={{
                                conviteId: inv.id,
                                parceiro: {
                                  id: otherUserId,
                                  nome: otherUser.nome || "Parceiro da reciclagem",
                                  perfil: labelPerfil,
                                  fotoPerfil: otherUser.fotoPerfil || "",
                                  cidade: otherUser.cidade || "",
                                  estado: otherUser.estado || "",
                                },
                              }}
                              className="convite-evaluate-button"
                            >
                              <FaStar />
                              Avaliar troca
                            </Link>
                          </>
                        ) : (
                          <span className="status-label refused">
                            <FaTimes /> Recusado
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
          </div>
        </section>
      </main>
      <Rodape />
    </>
  );
}
