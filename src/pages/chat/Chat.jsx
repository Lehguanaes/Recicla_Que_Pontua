import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../services/Firebase";
import { doc, getDoc } from "firebase/firestore";
import {
  listenToUserChats,
  listenToChatMessages,
  sendMessage,
  markMessagesAsRead,
} from "../../services/chatService";
import {
  FaComments,
  FaPaperPlane,
  FaCheck,
  FaCheckDouble,
  FaUserCircle,
  FaChevronLeft,
} from "react-icons/fa";
import Navbar from "../../components/navbar/Navbar";
import Rodape from "../../components/rodape/Rodape";
import { PageHeader } from "../../components/typography/Typography";
import EmptyState from "../../components/common/EmptyState";
import Button from "../../components/button/Button";
import "./chat.css";

const PERFIL_LABELS = {
  "pessoa-recicladora": "Reciclador",
  "instituicao-recicladora": "Instituição",
  "coletor-autonomo": "Catador",
  "centro-coleta": "Centro de Coleta",
};

export default function Chat() {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [profiles, setProfiles] = useState({});
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(true);
  const [mobileActivePanel, setMobileActivePanel] = useState("list"); // "list" | "chat"

  const messagesEndRef = useRef(null);

  // Scroll to bottom helper
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  // 1. Listen to chats
  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    const unsubscribe = listenToUserChats(user.uid, async (userChats) => {
      setChats(userChats);
      setLoading(false);

      // Fetch profiles of other participants
      const uidsToFetch = [];
      userChats.forEach((chat) => {
        const otherUid = chat.participantes.find((id) => id !== user.uid);
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
  }, [user?.uid, profiles]);

  // 2. Listen to messages of the selected chat
  useEffect(() => {
    if (!selectedChat?.id || !user?.uid) {
      setMessages([]);
      return;
    }

    // Mark existing messages as read
    markMessagesAsRead(selectedChat.id, user.uid);

    const unsubscribe = listenToChatMessages(selectedChat.id, (chatMessages) => {
      setMessages(chatMessages);
      // Mark new incoming messages as read
      markMessagesAsRead(selectedChat.id, user.uid);
    });

    return unsubscribe;
  }, [selectedChat?.id, user?.uid]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedChat?.id || !user?.uid) return;

    const textToSend = messageText;
    setMessageText("");

    try {
      await sendMessage(selectedChat.id, user.uid, textToSend);
    } catch (err) {
      console.error("Erro ao enviar mensagem:", err);
    }
  };

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    setMobileActivePanel("chat");
  };

  const handleBackToList = () => {
    setMobileActivePanel("list");
  };

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
      <>
        <Navbar />
        <div className="chat-page-loading">
          <div className="chat-spinner"></div>
          <p>Carregando conversas...</p>
        </div>
        <Rodape />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="chat-page">
        {chats.length === 0 ? (
          <div className="chat-container">
            <PageHeader
              className="chat-header"
              eyebrowClassName="chat-kicker"
              eyebrow="Conversas"
              icon={<FaComments />}
              title="Converse com seus parceiros de reciclagem"
              text="Depois que um convite for aceito, a conversa ficará disponível aqui para vocês combinarem os detalhes da entrega."
            />

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
          </div>
        ) : (
          <div className={`chat-layout-container panel-${mobileActivePanel}`}>
            
            {/* Chat List Panel */}
            <section className="chat-list-panel">
              <header className="chat-panel-header">
                <h2><FaComments /> Mensagens</h2>
              </header>

              <div className="chat-list-scroll">
                {chats.map((chat) => {
                  const otherUid = chat.participantes.find((id) => id !== user.uid);
                  const otherUser = profiles[otherUid] || {};
                  const isSelected = selectedChat?.id === chat.id;

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
              {selectedChat ? (
                <>
                  {/* Conversation Header */}
                  <header className="conversation-header">
                    <button className="chat-back-btn" onClick={handleBackToList}>
                      <FaChevronLeft />
                    </button>

                    {(() => {
                      const otherUid = selectedChat.participantes.find((id) => id !== user.uid);
                      const otherUser = profiles[otherUid] || {};
                      const labelPerfil = PERFIL_LABELS[otherUser.perfil] || otherUser.perfil || "Parceiro";

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
                  </header>

                  {/* Conversation Messages */}
                  <div className="conversation-messages-area">
                    {messages.map((msg) => {
                      const isMine = msg.remetenteId === user.uid;

                      return (
                        <div
                          key={msg.id}
                          className={`message-bubble-wrapper ${isMine ? "outgoing" : "incoming"}`}
                        >
                          <div className="message-bubble">
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
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Conversation Input Form */}
                  <form className="conversation-input-form" onSubmit={handleSendMessage}>
                    <input
                      type="text"
                      placeholder="Digite uma mensagem..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      aria-label="Mensagem"
                    />
                    <button type="submit" disabled={!messageText.trim()}>
                      <FaPaperPlane />
                    </button>
                  </form>
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
      </main>

      <Rodape />
    </>
  );
}
