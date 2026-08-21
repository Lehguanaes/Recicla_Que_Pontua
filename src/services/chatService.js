import { db } from "./Firebase";
import { PROFILE_IDS } from "../constants/profiles";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  serverTimestamp,
  orderBy,
  writeBatch,
  runTransaction,
} from "firebase/firestore";

/**
 * Checks if a chat already exists between two users.
 * Returns the chat document details if it exists, or null.
 */
export async function getExistingChat(uid1, uid2) {
  try {
    const q = query(
      collection(db, "chats"),
      where("participantes", "array-contains", uid1)
    );
    const querySnapshot = await getDocs(q);
    let existingChat = null;
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data.participantes && data.participantes.includes(uid2)) {
        existingChat = { id: docSnap.id, ...data };
      }
    });
    return existingChat;
  } catch (err) {
    console.error("Erro ao buscar chat existente:", err);
    return null;
  }
}

/**
 * Creates a new chat between two users if one does not already exist.
 */
export async function createChatIfNotExists(uid1, uid2) {
  const existing = await getExistingChat(uid1, uid2);
  if (existing) {
    return existing.id;
  }

  try {
    const newChatRef = doc(collection(db, "chats"));
    const chatData = {
      chatId: newChatRef.id,
      participantes: [uid1, uid2],
      createdAt: serverTimestamp(),
      lastMessage: "",
      lastMessageAt: null,
      lastSenderId: null,
      lastReadBy: {},
      status: "ativa",
      avaliacoes: {},
    };
    await setDoc(newChatRef, chatData);
    return newChatRef.id;
  } catch (err) {
    console.error("Erro ao criar chat:", err);
    throw err;
  }
}

function joinMaterialDescriptions(materials = []) {
  const descriptions = materials
    .filter((material) => material?.label && Number(material.quantity) > 0)
    .map(
      (material) =>
        `${material.quantity} ${material.unit || "un"} de ${material.label}`
    );

  if (descriptions.length === 0) return "os materiais indicados no convite";
  if (descriptions.length === 1) return descriptions[0];
  return `${descriptions.slice(0, -1).join(", ")} e ${descriptions.at(-1)}`;
}

function buildExchangeSummary(materials = []) {
  const validMaterials = materials.filter(
    (material) => material?.label && Number(material.quantity) > 0
  );

  if (validMaterials.length === 0) {
    return "Olá! Quero iniciar uma nova troca. Podemos combinar os materiais e os detalhes por aqui?";
  }

  return `Olá! Estes são os materiais indicados para esta troca: ${joinMaterialDescriptions(
    validMaterials
  )}. Podemos combinar os detalhes por aqui?`;
}

function hasDirectExchangeAccess(sender, recipient, senderId) {
  const allowedSenders = Array.isArray(recipient?.acessosDiretosChat)
    ? recipient.acessosDiretosChat
    : [];
  const senderCanRequest = [PROFILE_IDS.PERSON, PROFILE_IDS.INSTITUTION].includes(
    sender?.perfil
  );
  const recipientCanGrant = [PROFILE_IDS.COLLECTOR, PROFILE_IDS.CENTER].includes(
    recipient?.perfil
  );

  return senderCanRequest && recipientCanGrant && allowedSenders.includes(senderId);
}

/**
 * Aceita o convite e cria um resumo automático da troca no chat.
 * O ID determinístico impede que a mesma solicitação gere mensagens duplicadas.
 */
export async function acceptInvitationWithAutomaticMessage(invitation) {
  if (!invitation?.id || !invitation.remetenteId || !invitation.destinatarioId) {
    throw new Error("Convite inválido para aceitação.");
  }

  const chatId = await createChatIfNotExists(
    invitation.remetenteId,
    invitation.destinatarioId
  );
  const requestId = String(
    invitation.solicitacaoId || `${invitation.id}-original`
  ).replaceAll("/", "-");
  const invitationRef = doc(db, "convites", invitation.id);
  const chatRef = doc(db, "chats", chatId);
  const automaticMessageRef = doc(
    db,
    "chats",
    chatId,
    "mensagens",
    `troca-${requestId}`
  );
  const automaticText = buildExchangeSummary(
    invitation.materiais || invitation.materials || []
  );

  await runTransaction(db, async (transaction) => {
    const invitationSnapshot = await transaction.get(invitationRef);
    const messageSnapshot = await transaction.get(automaticMessageRef);

    if (!invitationSnapshot.exists()) {
      throw new Error("O convite não está mais disponível.");
    }

    if (!messageSnapshot.exists()) {
      transaction.set(automaticMessageRef, {
        remetenteId: invitation.remetenteId,
        texto: automaticText,
        createdAt: serverTimestamp(),
        visualizada: false,
        automatico: true,
        tipo: "resumo_troca",
        conviteId: invitation.id,
        materiais: invitation.materiais || invitation.materials || [],
      });
      transaction.update(chatRef, {
        lastMessage: automaticText,
        lastMessageAt: serverTimestamp(),
        lastSenderId: invitation.remetenteId,
        conviteId: invitation.id,
        solicitacaoId: requestId,
        status: "ativa",
        finalizadaEm: null,
        finalizadaPor: null,
        avaliacoes: {},
      });
    }

    if (invitationSnapshot.data().status !== "aceito") {
      transaction.update(invitationRef, {
        status: "aceito",
        respondedAt: serverTimestamp(),
      });
    }
  });

  return chatId;
}

/**
 * Inicia uma nova troca sem convite quando o coletor/centro concedeu acesso
 * direto ao perfil reciclador em uma avaliação anterior.
 */
export async function startDirectExchange({ senderId, recipientId, materials = [] }) {
  if (!senderId || !recipientId) {
    throw new Error("Não foi possível identificar os participantes da troca.");
  }

  const senderRef = doc(db, "usuarios", senderId);
  const recipientRef = doc(db, "usuarios", recipientId);
  const [initialSenderSnapshot, initialRecipientSnapshot] = await Promise.all([
    getDoc(senderRef),
    getDoc(recipientRef),
  ]);

  if (
    !initialSenderSnapshot.exists() ||
    !initialRecipientSnapshot.exists() ||
    !hasDirectExchangeAccess(
      initialSenderSnapshot.data(),
      initialRecipientSnapshot.data(),
      senderId
    )
  ) {
    const error = new Error("Este perfil ainda exige o envio de um convite.");
    error.code = "chat/direct-access-not-allowed";
    throw error;
  }

  const chatId = await createChatIfNotExists(senderId, recipientId);
  const requestId = `direto-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
  const chatRef = doc(db, "chats", chatId);
  const automaticMessageRef = doc(
    db,
    "chats",
    chatId,
    "mensagens",
    `troca-${requestId}`
  );
  const automaticText = buildExchangeSummary(materials);

  await runTransaction(db, async (transaction) => {
    const [senderSnapshot, recipientSnapshot, chatSnapshot] = await Promise.all([
      transaction.get(senderRef),
      transaction.get(recipientRef),
      transaction.get(chatRef),
    ]);

    if (!senderSnapshot.exists() || !recipientSnapshot.exists() || !chatSnapshot.exists()) {
      throw new Error("Não foi possível localizar os participantes da troca.");
    }

    if (
      !hasDirectExchangeAccess(
        senderSnapshot.data(),
        recipientSnapshot.data(),
        senderId
      )
    ) {
      const error = new Error("Este perfil ainda exige o envio de um convite.");
      error.code = "chat/direct-access-not-allowed";
      throw error;
    }

    transaction.set(automaticMessageRef, {
      remetenteId: senderId,
      texto: automaticText,
      createdAt: serverTimestamp(),
      visualizada: false,
      automatico: true,
      tipo: "resumo_troca",
      acessoDireto: true,
      solicitacaoId: requestId,
      materiais: materials,
    });

    transaction.update(chatRef, {
      lastMessage: automaticText,
      lastMessageAt: serverTimestamp(),
      lastSenderId: senderId,
      conviteId: null,
      solicitacaoId: requestId,
      status: "ativa",
      finalizadaEm: null,
      finalizadaPor: null,
      avaliacoes: {},
    });
  });

  return chatId;
}

/** Encerra a troca sem excluir o histórico da conversa. */
export async function finalizeExchange(chatId, currentUserId) {
  if (!chatId || !currentUserId) {
    throw new Error("Não foi possível identificar a troca.");
  }

  const chatRef = doc(db, "chats", chatId);
  const currentUserRef = doc(db, "usuarios", currentUserId);
  await runTransaction(db, async (transaction) => {
    const [chatSnapshot, currentUserSnapshot] = await Promise.all([
      transaction.get(chatRef),
      transaction.get(currentUserRef),
    ]);

    if (!chatSnapshot.exists()) throw new Error("Conversa não encontrada.");
    if (!currentUserSnapshot.exists()) throw new Error("Perfil não encontrado.");

    const chat = chatSnapshot.data();
    if (!chat.participantes?.includes(currentUserId)) {
      throw new Error("Você não participa desta troca.");
    }
    if (
      ![PROFILE_IDS.COLLECTOR, PROFILE_IDS.CENTER].includes(
        currentUserSnapshot.data().perfil
      )
    ) {
      const error = new Error("Somente coletores e centros podem encerrar a troca.");
      error.code = "chat/not-allowed-to-finish";
      throw error;
    }

    if (chat.status === "finalizada") return;

    transaction.update(chatRef, {
      status: "finalizada",
      finalizadaEm: serverTimestamp(),
      finalizadaPor: currentUserId,
      lastMessage: "Troca finalizada",
      lastMessageAt: serverTimestamp(),
      lastSenderId: currentUserId,
    });
  });
}

/**
 * Subscribes to the real-time list of chats for the current user.
 */
export function listenToUserChats(uid, callback) {
  const q = query(
    collection(db, "chats"),
    where("participantes", "array-contains", uid)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const chatsList = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        chatsList.push({ id: docSnap.id, ...data });
      });
      // Sort by lastMessageAt descending on client side
      chatsList.sort((a, b) => {
        const timeA = a.lastMessageAt?.seconds || 0;
        const timeB = b.lastMessageAt?.seconds || 0;
        return timeB - timeA;
      });
      callback(chatsList);
    },
    (err) => {
      console.error("Erro ao escutar chats do usuário:", err);
    }
  );
}

/**
 * Subscribes to messages of a chat in real-time.
 */
export function listenToChatMessages(chatId, callback) {
  const q = query(
    collection(db, "chats", chatId, "mensagens"),
    orderBy("createdAt", "asc")
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const messages = [];
      snapshot.forEach((docSnap) => {
        messages.push({ id: docSnap.id, ...docSnap.data() });
      });
      callback(messages);
    },
    (err) => {
      console.error("Erro ao escutar mensagens do chat:", err);
    }
  );
}

/**
 * Sends a message in a chat and updates the lastMessage metadata.
 */
export async function sendMessage(chatId, senderId, text) {
  if (!text.trim()) return;

  try {
    const messagesCollection = collection(db, "chats", chatId, "mensagens");
    const newMessageRef = doc(messagesCollection);
    const chatRef = doc(db, "chats", chatId);

    await runTransaction(db, async (transaction) => {
      const chatSnapshot = await transaction.get(chatRef);
      if (!chatSnapshot.exists()) throw new Error("Conversa não encontrada.");
      if (chatSnapshot.data().status === "finalizada") {
        const error = new Error("Esta troca já foi finalizada.");
        error.code = "chat/exchange-finished";
        throw error;
      }

      transaction.set(newMessageRef, {
        remetenteId: senderId,
        texto: text,
        createdAt: serverTimestamp(),
        visualizada: false,
      });
      transaction.update(chatRef, {
        lastMessage: text,
        lastMessageAt: serverTimestamp(),
        lastSenderId: senderId,
      });
    });
  } catch (err) {
    console.error("Erro ao enviar mensagem:", err);
    throw err;
  }
}

/**
 * Marks all received unread messages in a chat as read.
 */
export async function markMessagesAsRead(chatId, currentUserId) {
  try {
    const q = query(
      collection(db, "chats", chatId, "mensagens"),
      where("remetenteId", "!=", currentUserId),
      where("visualizada", "==", false)
    );
    
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const batch = writeBatch(db);
      querySnapshot.forEach((docSnap) => {
        batch.update(docSnap.ref, { visualizada: true });
      });
      await batch.commit();
    }

    await updateDoc(doc(db, "chats", chatId), {
      [`lastReadBy.${currentUserId}`]: serverTimestamp(),
    });
  } catch (err) {
    console.error("Erro ao marcar mensagens como lidas:", err);
  }
}
