import Navbar from "../../components/navbar/Navbar";
import Rodape from "../../components/rodape/Rodape";
import './comoFunciona.css';
import Comunidade from "./blog/Blog";

export default function ComoFunciona() {
  return (
    <>
      <Navbar />

      <main className="como-funciona">
        <Comunidade />
      </main>

      <Rodape />
    </>
  );
}
