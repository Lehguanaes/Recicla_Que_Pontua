import Navbar from "../../components/navbar/Navbar";
import Rodape from "../../components/rodape/Rodape";
import { useAuth } from "../../contexts/AuthContext";

export default function Perfil() {

  const { user } = useAuth();

  return (
    <>
      <Navbar />

      <h1>Meu Perfil</h1>

      <p>Seja bem-vindo(a)!</p>
      <p>Email: {user?.email}</p>

      <Rodape />
    </>
  );
}