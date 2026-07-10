import { createContext, useContext, useEffect, useState } from "react";
import Loading from "./Loading";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import { auth } from "../services/Firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/Firebase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (usuario) => {

    if (usuario) {

      const docRef = doc(db, "usuarios", usuario.uid);

      const snapshot = await getDoc(docRef);

      if (snapshot.exists()) {

        setUser({
          ...usuario,
          ...snapshot.data(),
        });

      } else {

        setUser(usuario);

      }

    } else {

      setUser(null);

    }

    setLoading(false);

  });

  return unsubscribe;

}, []);

  async function cadastrar(email, senha) {
    const credencial = await createUserWithEmailAndPassword(
      auth,
      email,
      senha
    );

    return credencial.user;
  }

  async function login(email, senha) {
    const credencial = await signInWithEmailAndPassword(
      auth,
      email,
      senha
    );

    return credencial.user;
  }

  async function logout() {
    await signOut(auth);
  }

  if (loading) {
    return <Loading/>;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        cadastrar,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}