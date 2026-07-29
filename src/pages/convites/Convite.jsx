import React, { useEffect, useState, useMemo } from "react";
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
import { FaUserCircle, FaCheck, FaTimes, FaInbox, FaHistory } from "react-icons/fa";
import Navbar from "../../components/navbar/Navbar";
import Rodape from "../../components/rodape/Rodape";
import "./convite.css";

const PERFIL_LABELS = {
  "pessoa-recicladora": "Pessoa Recicladora",
  "instituicao-recicladora": "Instituição Recicladora",
  "coletor-autonomo": "Catador Autônomo",
  "centro-coleta": "Centro de Coleta",
};

export default function Convite() {
  const { user } = useAuth();
  const [receivedInvitations, setReceivedInvitations] = useState([]);
  const [senders, setSenders] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pendentes"); // "pendentes" | "historico"

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "convites"),
      where("destinatarioId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const list = [];
      const senderIds = new Set();

      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        list.push({ id: docSnap.id, ...data });
        senderIds.add(data.remetenteId);
      });

      // Sort: most recent first
      list.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });

      setReceivedInvitations(list);

      // Fetch user profile info for senders
      const fetchedSenders = {};
      let updated = false;

      for (const senderId of senderIds) {
        try {
          const userSnap = await getDoc(doc(db, "usuarios", senderId));
          if (userSnap.exists()) {
            fetchedSenders[senderId] = userSnap.data();
            updated = true;
          }
        } catch (err) {
          console.error("Erro ao carregar remetente:", err);
        }
      }

      if (updated) {
        setSenders((prev) => ({ ...prev, ...fetchedSenders }));
      }
      setLoading(false);
    }, (err) => {
      console.error("Erro ao assinar convites recebidos:", err);
      setLoading(false);
    });

    return unsubscribe;
  }, [user?.uid]);

  const handleAccept = async (invitationId) => {
    try {
      const docRef = doc(db, "convites", invitationId);
      await updateDoc(docRef, {
        status: "aceito",
        respondedAt: serverTimestamp(),
      });
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
      return receivedInvitations.filter((inv) => inv.status === "pendente");
    } else {
      return receivedInvitations.filter((inv) => inv.status !== "pendente");
    }
  }, [receivedInvitations, activeTab]);

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
        <section className="convites-container">
          <header className="convites-header">
            <h1>Gerenciamento de Convites</h1>
            <p>Gerencie as solicitações de conversa recebidas de outros usuários.</p>
          </header>

          {/* Tabs */}
          <div className="convites-tabs">
            <button
              className={`convites-tab-btn ${activeTab === "pendentes" ? "active" : ""}`}
              onClick={() => setActiveTab("pendentes")}
            >
              <FaInbox className="tab-icon" />
              <span>Pendentes</span>
              {receivedInvitations.filter((inv) => inv.status === "pendente").length > 0 && (
                <span className="badge-count">
                  {receivedInvitations.filter((inv) => inv.status === "pendente").length}
                </span>
              )}
            </button>
            <button
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
                const sender = senders[inv.remetenteId] || {};
                const labelPerfil = PERFIL_LABELS[sender.perfil] || sender.perfil || "Usuário";

                return (
                  <div key={inv.id} className={`convite-card ${inv.status}`}>
                    <div className="convite-card-avatar">
                      {sender.fotoPerfil ? (
                        <img src={sender.fotoPerfil} alt={sender.nome} className="avatar-img" />
                      ) : (
                        <FaUserCircle size={56} className="avatar-placeholder" />
                      )}
                    </div>
                    <div className="convite-card-info">
                      <div className="sender-name-wrapper">
                        <h3>{sender.nome || "Usuário sem nome"}</h3>
                        <span className="perfil-tag">{labelPerfil}</span>
                      </div>
                      
                      <div className="sender-details">
                        {sender.cidade && sender.estado && (
                          <p className="detail-item">
                            📍 {sender.cidade} - {sender.estado}
                          </p>
                        )}
                        {sender.telefone && (
                          <p className="detail-item">
                            📞 {sender.telefone}
                          </p>
                        )}
                        <p className="detail-item date">
                          Enviado em: {formatDate(inv.createdAt)}
                        </p>
                        {inv.respondedAt && (
                          <p className="detail-item date">
                            Respondido em: {formatDate(inv.respondedAt)}
                          </p>
                        )}
                      </div>
                    </div>

                    {inv.status === "pendente" ? (
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
                    ) : (
                      <div className="convite-card-status">
                        {inv.status === "aceito" ? (
                          <span className="status-label accepted">
                            <FaCheck /> Aceito
                          </span>
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
        </section>
      </main>
      <Rodape />
    </>
  );
}
