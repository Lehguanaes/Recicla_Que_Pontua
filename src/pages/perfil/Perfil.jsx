import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import Rodape from "../../components/rodape/Rodape";
import { useAuth } from "../../contexts/AuthContext";

export default function Perfil() {

  const navigate = useNavigate();

  const { user, logout } = useAuth();

  async function handleLogout() {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <Navbar />

      <h1>Meu Perfil</h1>

      <p>Seja bem-vindo!</p>

      <p>Email: {user?.email}</p>

      <p>UID: {user?.uid}</p>

      <button onClick={handleLogout}>
        Sair
      </button>

      <Rodape />
    </>
  );
}