import { createContext, useContext, useEffect, useState } from "react";
import Loading from "./Loading";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import { auth } from "../services/Firebase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usuario) => {
    setUser(usuario);

    setTimeout(() => {
      setLoading(false);
    }); 
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
    return <Loading mensagem="Espere um pouco..." />;
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