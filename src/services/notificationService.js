import {
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "./Firebase";

function timestampToMillis(timestamp) {
  if (!timestamp) return 0;
  if (typeof timestamp.toMillis === "function") return timestamp.toMillis();
  if (typeof timestamp.seconds === "number") {
    return timestamp.seconds * 1000 + Math.floor((timestamp.nanoseconds || 0) / 1e6);
  }
  const parsed = new Date(timestamp).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
}

function shortenText(text, maxLength = 78) {
  const normalized = String(text || "").trim();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength - 1).trim()}…`;
}

/**
 * Reúne, em tempo real, eventos que já existem no Firestore e podem ser
 * apresentados como notificações. Nenhum dado é duplicado em outra coleção.
 */
export function subscribeToUserNotifications(userId, onSuccess, onError) {
  if (!userId) return () => {};

  const sources = {
    receivedInvites: [],
    acceptedInvites: [],
    approvedContent: [],
    messages: [],
  };

  function publish() {
    const notifications = Object.values(sources)
      .flat()
      .sort((a, b) => timestampToMillis(b.timestamp) - timestampToMillis(a.timestamp));
    onSuccess(notifications);
  }

  function handleError(context) {
    return (error) => {
      console.error(`Erro ao carregar notificações de ${context}:`, error);
      onError?.(error);
    };
  }

  const receivedInvitesQuery = query(
    collection(db, "convites"),
    where("destinatarioId", "==", userId)
  );
  const sentInvitesQuery = query(
    collection(db, "convites"),
    where("remetenteId", "==", userId)
  );
  const approvedContentQuery = query(
    collection(db, "blog"),
    where("autorId", "==", userId)
  );
  const chatsQuery = query(
    collection(db, "chats"),
    where("participantes", "array-contains", userId)
  );

  const unsubscribers = [
    onSnapshot(
      receivedInvitesQuery,
      (snapshot) => {
        sources.receivedInvites = snapshot.docs
          .map((document) => ({ id: document.id, ...document.data() }))
          .filter((invite) => invite.status === "pendente")
          .map((invite) => ({
            id: `invite-received-${invite.id}-${timestampToMillis(invite.createdAt)}`,
            type: "invite",
            title: "Novo convite recebido",
            message: "Uma pessoa quer conversar com você sobre uma troca de materiais.",
            timestamp: invite.createdAt,
            to: "/convites",
          }));
        publish();
      },
      handleError("convites recebidos")
    ),
    onSnapshot(
      sentInvitesQuery,
      (snapshot) => {
        sources.acceptedInvites = snapshot.docs
          .map((document) => ({ id: document.id, ...document.data() }))
          .filter((invite) => invite.status === "aceito")
          .map((invite) => ({
            id: `invite-accepted-${invite.id}-${timestampToMillis(invite.respondedAt)}`,
            type: "accepted",
            title: "Seu convite foi aceito",
            message: "A conversa já está disponível para vocês combinarem a entrega.",
            timestamp: invite.respondedAt || invite.createdAt,
            to: "/chat",
          }));
        publish();
      },
      handleError("convites aceitos")
    ),
    onSnapshot(
      approvedContentQuery,
      (snapshot) => {
        sources.approvedContent = snapshot.docs
          .map((document) => ({ id: document.id, ...document.data() }))
          .filter((content) => content.status === "publicado")
          .map((content) => ({
            id: `content-approved-${content.id}`,
            type: "approved",
            title: "Conteúdo aprovado",
            message: "Sua contribuição foi aprovada e já aparece no Blog do Reci.",
            timestamp: content.publicadoEm || content.updatedAt || content.createdAt,
            to: "/como-reciclar",
          }));
        publish();
      },
      handleError("conteúdos aprovados")
    ),
    onSnapshot(
      chatsQuery,
      (snapshot) => {
        sources.messages = snapshot.docs
          .map((document) => ({ id: document.id, ...document.data() }))
          .filter((chat) => {
            if (!chat.lastMessage || chat.lastSenderId === userId) return false;
            const lastMessageAt = timestampToMillis(chat.lastMessageAt);
            const lastReadAt = timestampToMillis(chat.lastReadBy?.[userId]);
            return lastMessageAt > lastReadAt;
          })
          .map((chat) => ({
            id: `message-${chat.id}-${timestampToMillis(chat.lastMessageAt)}`,
            type: "message",
            title: "Nova mensagem no chat",
            message: shortenText(chat.lastMessage),
            timestamp: chat.lastMessageAt,
            to: "/chat",
          }));
        publish();
      },
      handleError("mensagens")
    ),
  ];

  return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
}

export function notificationTimestampToDate(timestamp) {
  const milliseconds = timestampToMillis(timestamp);
  return milliseconds ? new Date(milliseconds) : null;
}
