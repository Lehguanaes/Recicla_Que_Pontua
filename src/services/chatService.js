import { db } from "./Firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  serverTimestamp,
  orderBy,
  writeBatch,
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
    };
    await setDoc(newChatRef, chatData);
    return newChatRef.id;
  } catch (err) {
    console.error("Erro ao criar chat:", err);
    throw err;
  }
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
    
    await setDoc(newMessageRef, {
      remetenteId: senderId,
      texto: text,
      createdAt: serverTimestamp(),
      visualizada: false,
    });

    // Update parent chat document last message details
    const chatRef = doc(db, "chats", chatId);
    await updateDoc(chatRef, {
      lastMessage: text,
      lastMessageAt: serverTimestamp(),
      lastSenderId: senderId,
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
