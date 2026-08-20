import {
  addDoc,
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./Firebase";

const SAVE_TIMEOUT_MS = 20_000;

function withTimeout(promise, timeoutMs) {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      const error = new Error("A operação demorou mais que o esperado.");
      error.code = "firestore/save-timeout";
      reject(error);
    }, timeoutMs);

    promise.then(
      (value) => {
        clearTimeout(timeoutId);
        resolve(value);
      },
      (error) => {
        clearTimeout(timeoutId);
        reject(error);
      }
    );
  });
}

export async function createBlogContribution(contribution) {
  const documentReference = await withTimeout(
    addDoc(collection(db, "blog"), {
      ...contribution,
      status: "pendente",
      createdAt: serverTimestamp(),
    }),
    SAVE_TIMEOUT_MS
  );

  return documentReference.id;
}

export function subscribeToBlogContributions(onSuccess, onError) {
  const contributionsQuery = query(
    collection(db, "blog"),
    orderBy("createdAt", "desc"),
    limit(30)
  );

  return onSnapshot(
    contributionsQuery,
    (snapshot) => {
      const contributions = snapshot.docs
        .map((document) => ({ id: document.id, ...document.data() }))
        .filter((contribution) => contribution.status === "publicado");

      onSuccess(contributions);
    },
    onError
  );
}
