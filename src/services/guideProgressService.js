import {
  doc,
  FieldPath,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "./Firebase";

export async function getGuideProgress(userId, guideId) {
  if (!userId || !guideId) return [];

  const userReference = doc(db, "usuarios", userId);
  const snapshot = await getDoc(userReference);

  return snapshot.exists()
    ? snapshot.data()?.progressoGuias?.[guideId]?.aulasConcluidas || []
    : [];
}

export async function saveGuideProgress(userId, guideId, completedLessons) {
  if (!userId || !guideId) return;

  const userReference = doc(db, "usuarios", userId);

  await updateDoc(
    userReference,
    new FieldPath("progressoGuias", guideId),
    {
      guiaId: guideId,
      aulasConcluidas: completedLessons,
      atualizadoEm: serverTimestamp(),
    }
  );
}
