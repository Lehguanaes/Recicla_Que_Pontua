import {
  arrayRemove,
  arrayUnion,
  doc,
  increment,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./Firebase";
import { PROFILE_IDS } from "../constants/profiles";

function evaluationError(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

export async function submitExchangeEvaluation({
  chatId,
  exchangeId = "",
  invitationId = "",
  evaluator,
  evaluated,
  rating,
  highlights,
  comment,
  addFavorite,
  allowDirectChat,
}) {
  if (!chatId || !evaluator?.id || !evaluated?.id) {
    throw evaluationError(
      "evaluation/invalid-exchange",
      "Não foi possível identificar esta troca."
    );
  }

  const normalizedRating = Math.min(5, Math.max(1, Number(rating) || 0));
  const bonusPoints = normalizedRating * 10;
  const normalizedExchangeId = String(
    exchangeId || invitationId || "original"
  ).replaceAll("/", "-");
  const chatRef = doc(db, "chats", chatId);
  const evaluationRef = doc(
    db,
    "avaliacoes",
    `${chatId}_${normalizedExchangeId}_${evaluator.id}`
  );
  const evaluatorRef = doc(db, "usuarios", evaluator.id);
  const evaluatedRef = doc(db, "usuarios", evaluated.id);
  let directAccessGranted = false;

  await runTransaction(db, async (transaction) => {
    const [chatSnapshot, evaluationSnapshot, evaluatorSnapshot, evaluatedSnapshot] =
      await Promise.all([
        transaction.get(chatRef),
        transaction.get(evaluationRef),
        transaction.get(evaluatorRef),
        transaction.get(evaluatedRef),
      ]);

    if (!chatSnapshot.exists() || chatSnapshot.data().status !== "finalizada") {
      throw evaluationError(
        "evaluation/exchange-not-finished",
        "Finalize a troca no chat antes de enviar a avaliação."
      );
    }

    const chatExchangeId = String(
      chatSnapshot.data().solicitacaoId ||
        chatSnapshot.data().conviteId ||
        "original"
    ).replaceAll("/", "-");
    if (chatExchangeId !== normalizedExchangeId) {
      throw evaluationError(
        "evaluation/invalid-exchange",
        "Esta avaliação não corresponde à troca finalizada."
      );
    }

    const participants = chatSnapshot.data().participantes || [];
    if (
      !participants.includes(evaluator.id) ||
      !participants.includes(evaluated.id) ||
      evaluator.id === evaluated.id
    ) {
      throw evaluationError(
        "evaluation/invalid-participants",
        "Os participantes desta avaliação não correspondem à troca."
      );
    }

    if (evaluationSnapshot.exists()) {
      throw evaluationError(
        "evaluation/already-submitted",
        "Você já avaliou esta troca."
      );
    }

    if (!evaluatorSnapshot.exists() || !evaluatedSnapshot.exists()) {
      throw evaluationError(
        "evaluation/profile-not-found",
        "Não foi possível localizar um dos perfis."
      );
    }

    const evaluatorProfile = evaluatorSnapshot.data().perfil;
    const evaluatedProfile = evaluatedSnapshot.data().perfil;
    const favoriteAdded = Boolean(
      addFavorite &&
        [PROFILE_IDS.PERSON, PROFILE_IDS.INSTITUTION].includes(evaluatorProfile)
    );
    const canManageDirectAccess =
      [PROFILE_IDS.COLLECTOR, PROFILE_IDS.CENTER].includes(evaluatorProfile) &&
      [PROFILE_IDS.PERSON, PROFILE_IDS.INSTITUTION].includes(evaluatedProfile);
    directAccessGranted = Boolean(allowDirectChat && canManageDirectAccess);

    transaction.set(evaluationRef, {
      avaliadorId: evaluator.id,
      avaliadorNome: evaluator.name || "",
      avaliadoId: evaluated.id,
      avaliadoNome: evaluated.name || "",
      chatId,
      solicitacaoId: normalizedExchangeId,
      conviteId: invitationId,
      nota: normalizedRating,
      pontosConcedidos: bonusPoints,
      destaques: highlights,
      comentario: String(comment || "").trim(),
      adicionouFavorito: favoriteAdded,
      permitiuAcessoDireto: directAccessGranted,
      createdAt: serverTimestamp(),
    });

    transaction.update(evaluatedRef, {
      pontos: increment(bonusPoints),
      avaliacaoSoma: increment(normalizedRating),
      avaliacaoQuantidade: increment(1),
    });

    const evaluatorUpdates = {};
    if (favoriteAdded) {
      evaluatorUpdates.favoritos = arrayUnion(evaluated.id);
    }
    if (canManageDirectAccess) {
      evaluatorUpdates.acessosDiretosChat = directAccessGranted
        ? arrayUnion(evaluated.id)
        : arrayRemove(evaluated.id);
    }
    if (Object.keys(evaluatorUpdates).length > 0) {
      transaction.update(evaluatorRef, evaluatorUpdates);
    }

    transaction.update(chatRef, {
      [`avaliacoes.${evaluator.id}`]: true,
    });
  });

  return { bonusPoints, directAccessGranted };
}
