import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../services/Firebase";
import { doc, getDoc } from "firebase/firestore";
import {
  listenToUserChats,
  listenToChatMessages,
  sendMessage,
  markMessagesAsRead,
  finalizeExchange,
} from "../../services/chatService";
import {
  FaComments,
  FaPaperPlane,
  FaCheck,
  FaCheckDouble,
  FaUserCircle,
  FaChevronLeft,
  FaRecycle,
  FaCheckCircle,
  FaExclamationCircle,
  FaStar,
} from "react-icons/fa";
import PageLayout from "../../components/layout/PageLayout";
import { PageHeader } from "../../components/typography/Typography";
import EmptyState from "../../components/common/EmptyState";
import Button from "../../components/button/Button";
import IconButton from "../../components/button/IconButton";
import Alert from "../../components/alert/Alert";
import FormMessage from "../../components/form/FormMessage";
import Loading from "../../contexts/Loading";
import { getProfileLabel, PROFILE_IDS } from "../../constants/profiles";
import "./chat.css";

export default function Chat() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const userId = user?.uid || "";
  const [chats, setChats] = useState([]);
  const [profiles, setProfiles] = useState({});
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(true);
  const [mobileActivePanel, setMobileActivePanel] = useState("list"); // "list" | "chat"
  const [finishConfirmOpen, setFinishConfirmOpen] = useState(false);
  const [finishingExchange, setFinishingExchange] = useState(false);
  const [finishError, setFinishError] = useState("");
  const activeChat = selectedChat
    ? chats.find((chat) => chat.id === selectedChat.id) || selectedChat
    : null;
  const canFinalizeExchange = [
    PROFILE_IDS.COLLECTOR,
    PROFILE_IDS.CENTER,
  ].includes(user?.perfil);
  const canRequestNewExchange = [
    PROFILE_IDS.PERSON,
    PROFILE_IDS.INSTITUTION,
  ].includes(user?.perfil);

  const messagesAreaRef = useRef(null);

  // Mantém a rolagem dentro da conversa sem deslocar a página inteira.
  const scrollToBottom = () => {
    const messagesArea = messagesAreaRef.current;
    if (!messagesArea) return;
    messagesArea.scrollTo({
      top: messagesArea.scrollHeight,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  // 1. Listen to chats
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const unsubscribe = listenToUserChats(userId, async (userChats) => {
      setChats(userChats);
      setSelectedChat((current) =>
        current
          ? userChats.find((chat) => chat.id === current.id) || current
          : current
      );
      setLoading(false);

      // Fetch profiles of other participants
      const uidsToFetch = [];
      userChats.forEach((chat) => {
        const otherUid = chat.participantes.find((id) => id !== userId);
        if (otherUid && !profiles[otherUid]) {
          uidsToFetch.push(otherUid);
        }
      });

      if (uidsToFetch.length > 0) {
        const fetchedProfiles = {};
        for (const uid of uidsToFetch) {
          try {
            const docSnap = await getDoc(doc(db, "usuarios", uid));
            if (docSnap.exists()) {
              fetchedProfiles[uid] = docSnap.data();
            }
          } catch (err) {
            console.error("Erro ao carregar perfil do participante:", err);
          }
        }
        setProfiles((prev) => ({ ...prev, ...fetchedProfiles }));
      }
    });

    return unsubscribe;
  }, [userId, profiles]);

  // 2. Listen to messages of the selected chat
  useEffect(() => {
    if (!activeChat?.id || !userId) {
      setMessages([]);
      return;
    }

    // Mark existing messages as read
    markMessagesAsRead(activeChat.id, userId);

    const unsubscribe = listenToChatMessages(activeChat.id, (chatMessages) => {
      setMessages(chatMessages);
      // Mark new incoming messages as read
      markMessagesAsRead(activeChat.id, userId);
    });

    return unsubscribe;
  }, [activeChat?.id, userId]);

  useEffect(() => {
    const requestedChatId = location.state?.chatId;
    if (!requestedChatId || chats.length === 0) return;

    const requestedChat = chats.find((chat) => chat.id === requestedChatId);
    if (!requestedChat) return;

    setSelectedChat(requestedChat);
    setMobileActivePanel("chat");
    navigate("/chat", { replace: true });
  }, [chats, location.state?.chatId, navigate]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (
      !messageText.trim() ||
      !activeChat?.id ||
      !userId ||
      activeChat.status === "finalizada"
    ) return;

    const textToSend = messageText;
    setMessageText("");

    try {
      await sendMessage(activeChat.id, userId, textToSend);
    } catch (err) {
      console.error("Erro ao enviar mensagem:", err);
      setMessageText(textToSend);
    }
  };

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    setMobileActivePanel("chat");
  };

  const handleBackToList = () => {
    setMobileActivePanel("list");
  };

  function getEvaluationState() {
    const partnerId = activeChat?.participantes?.find((id) => id !== userId);
    const partner = profiles[partnerId] || {};

    return {
      chatId: activeChat?.id || "",
      conviteId: activeChat?.conviteId || "",
      solicitacaoId:
        activeChat?.solicitacaoId || activeChat?.conviteId || "original",
      parceiro: {
        id: partnerId,
        nome: partner.nome || "Parceiro da reciclagem",
        perfil: getProfileLabel(partner.perfil, "Perfil da comunidade"),
        perfilId: partner.perfil || "",
        fotoPerfil: partner.fotoPerfil || partner.foto || "",
        cidade: partner.endereco?.cidade || partner.cidade || "",
        estado: partner.endereco?.estado || partner.estado || "",
      },
    };
  }

  function goToEvaluation() {
    navigate("/avaliacao", { state: getEvaluationState() });
  }

  async function handleFinishExchange() {
    if (!activeChat?.id || !userId || finishingExchange) return;

    setFinishingExchange(true);
    setFinishError("");
    try {
      await finalizeExchange(activeChat.id, userId);
      setFinishConfirmOpen(false);
      goToEvaluation();
    } catch (error) {
      console.error("Erro ao finalizar troca:", error);
      setFinishError("Não foi possível finalizar a troca agora. Tente novamente.");
    } finally {
      setFinishingExchange(false);
    }
  }

  const formatMessageTime = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatLastMessageTime = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    }
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  };

  if (loading) {
    return (
      <PageLayout>
        <Loading mensagem="Carregando conversas" />
      </PageLayout>
    );
  }

  if (!userId) return null;

  return (
    <PageLayout>
      <main className="chat-page">
        <div className="chat-container">
          <PageHeader
            className="chat-header"
            eyebrowClassName="chat-kicker"
            eyebrow="Conversas"
            icon={<FaComments />}
            title="Converse com seus parceiros de reciclagem"
            text="Depois que um convite for aceito, a conversa ficará disponível aqui para vocês combinarem os detalhes da entrega."
          />

          {chats.length === 0 ? (
            <EmptyState
              as="section"
              className="chat-empty"
              title="Nenhuma conversa por aqui"
              titleId="chat-empty-title"
              text="Acompanhe seus convites e, quando uma solicitação for aceita, volte para iniciar a conversa."
              icon={<FaPaperPlane />}
              iconClassName="chat-empty-icon"
            >
              <Button variant="green" to="/convites" className="chat-empty-button">
                Ver meus convites
              </Button>
            </EmptyState>
          ) : (
            <div className={`chat-layout-container panel-${mobileActivePanel}`}>
            
            {/* Chat List Panel */}
            <section className="chat-list-panel">
              <header className="chat-panel-header">
                <h2><FaComments /> Mensagens</h2>
              </header>

              <div className="chat-list-scroll">
                {chats.map((chat) => {
                  const otherUid = chat.participantes.find((id) => id !== userId);
                  const otherUser = profiles[otherUid] || {};
                  const isSelected = activeChat?.id === chat.id;

                  return (
                    <button
                      key={chat.id}
                      className={`chat-item-btn ${isSelected ? "active" : ""}`}
                      onClick={() => handleSelectChat(chat)}
                    >
                      <div className="chat-item-avatar">
                        {otherUser.fotoPerfil || otherUser.foto ? (
                          <img
                            src={otherUser.fotoPerfil || otherUser.foto}
                            alt={otherUser.nome}
                            className="chat-avatar-img"
                          />
                        ) : (
                          <FaUserCircle size={44} className="chat-avatar-placeholder" />
                        )}
                      </div>

                      <div className="chat-item-details">
                        <div className="chat-item-row">
                          <span className="chat-item-name">{otherUser.nome || "Parceiro"}</span>
                          <span className="chat-item-time">
                            {formatLastMessageTime(chat.lastMessageAt)}
                          </span>
                        </div>

                        <div className="chat-item-row">
                          <span className="chat-item-last-msg">
                            {chat.lastMessage || "Nenhuma mensagem enviada."}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Conversation Panel */}
            <section className="chat-conversation-panel">
              {activeChat ? (
                <>
                  {/* Conversation Header */}
                  <header className="conversation-header">
                    <IconButton
                      className="chat-back-btn"
                      label="Voltar para a lista de conversas"
                      onClick={handleBackToList}
                    >
                      <FaChevronLeft />
                    </IconButton>

                    {(() => {
                      const otherUid = activeChat.participantes.find((id) => id !== userId);
                      const otherUser = profiles[otherUid] || {};
                      const labelPerfil = getProfileLabel(otherUser.perfil, "Parceiro");

                      return (
                        <>
                          <div className="conversation-header-avatar">
                            {otherUser.fotoPerfil || otherUser.foto ? (
                              <img
                                src={otherUser.fotoPerfil || otherUser.foto}
                                alt={otherUser.nome}
                                className="chat-avatar-img"
                              />
                            ) : (
                              <FaUserCircle size={40} className="chat-avatar-placeholder" />
                            )}
                          </div>

                          <div className="conversation-header-info">
                            <h3>{otherUser.nome || "Parceiro"}</h3>
                            <span className="perfil-badge">{labelPerfil}</span>
                          </div>
                        </>
                      );
                    })()}

                    <div className="conversation-header-actions">
                      {activeChat.status === "finalizada" ? (
                        activeChat.avaliacoes?.[userId] ? (
                          <span className="chat-finished-badge">
                            <FaCheckCircle /> Troca Finalizada
                          </span>
                        ) : (
                          <Button
                            variant="green"
                            type="button"
                            className="chat-evaluate-button"
                            onClick={goToEvaluation}
                          >
                            <FaStar /> Avaliar troca
                          </Button>
                        )
                      ) : canFinalizeExchange ? (
                        <Button
                          variant="gradient"
                          type="button"
                          className="chat-finish-button"
                          onClick={() => {
                            setFinishError("");
                            setFinishConfirmOpen(true);
                          }}
                        >
                          <FaCheckCircle /> Encerrar Troca
                        </Button>
                      ) : null}
                    </div>
                  </header>

                  {/* Conversation Messages */}
                  <div className="conversation-messages-area" ref={messagesAreaRef}>
                    {messages.map((msg) => {
                      if (msg.tipo === "troca_finalizada") {
                        return null;
                      }

                      const isMine = msg.remetenteId === userId;

                      return (
                        <div
                          key={msg.id}
                          className={`message-bubble-wrapper ${isMine ? "outgoing" : "incoming"}`}
                        >
                          <div className="message-bubble">
                            {msg.automatico && (
                              <span className="automatic-message-label">
                                <FaRecycle /> Resumo automático da troca
                              </span>
                            )}
                            <p className="message-text">{msg.texto}</p>
                            <div className="message-meta">
                              <span className="message-time">
                                {formatMessageTime(msg.createdAt)}
                              </span>
                              {isMine && (
                                <span className={`message-status ${msg.visualizada ? "read" : "sent"}`}>
                                  {msg.visualizada ? <FaCheckDouble /> : <FaCheck />}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Conversation Input Form */}
                  {activeChat.status === "finalizada" &&
                  (canRequestNewExchange || canFinalizeExchange) ? (
                    <div className="chat-closed-notice" role="status">
                      <FaExclamationCircle aria-hidden="true" />
                      <div>
                        <strong>Troca Finalizada</strong>
                        <span>
                          {canRequestNewExchange
                            ? "Para iniciar uma nova conversa, envie uma nova solicitação."
                            : "Aguarde uma nova solicitação de troca para iniciar outra conversa."}
                        </span>
                      </div>
                    </div>
                  ) : activeChat.status !== "finalizada" ? (
                    <form className="conversation-input-form" onSubmit={handleSendMessage}>
                      <input
                        type="text"
                        placeholder="Digite uma mensagem..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        aria-label="Mensagem"
                      />
                      <IconButton
                        type="submit"
                        label="Enviar mensagem"
                        disabled={!messageText.trim()}
                      >
                        <FaPaperPlane />
                      </IconButton>
                    </form>
                  ) : null}
                </>
              ) : (
                <div className="chat-empty-panel">
                  <span className="chat-empty-panel-icon"><FaComments /></span>
                  <h3>Selecione uma conversa</h3>
                  <p>Escolha um parceiro ao lado para enviar e receber mensagens sobre a reciclagem.</p>
                </div>
              )}
            </section>

            </div>
          )}
        </div>
      </main>

      <Alert
        isOpen={finishConfirmOpen}
        title="Encerrar esta troca?"
        message="O chat será fechado para novas mensagens, mas todo o histórico continuará disponível. Depois, você poderá avaliar o parceiro."
        variant="warning"
        confirmText="Encerrar e avaliar"
        cancelText="Continuar conversa"
        onConfirm={handleFinishExchange}
        onCancel={() => {
          if (finishingExchange) return;
          setFinishConfirmOpen(false);
          setFinishError("");
        }}
        loading={finishingExchange}
      >
        <FormMessage>{finishError}</FormMessage>
      </Alert>
    </PageLayout>
  );
}
