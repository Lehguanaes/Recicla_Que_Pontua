import Navbar from "../../components/navbar/Navbar";
import Rodape from "../../components/rodape/Rodape";
import Hero from "./secoes/Hero";
import Problema from "./secoes/Problema";
import Pesquisa from "./secoes/Pesquisa";
import Decisoes from "./secoes/Decisoes";

import './comoFunciona.css';

export default function ComoFunciona() {
  return (
    <>
      <Navbar />

        <main className="como-funciona">
      <Hero />
      <Problema />
      <Pesquisa />
      <Decisoes />
      </main>

      <Rodape />
    </>
  );
}
