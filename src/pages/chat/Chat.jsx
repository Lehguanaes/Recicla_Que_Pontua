import { Link } from "react-router-dom";
import { FaComments, FaPaperPlane } from "react-icons/fa";
import Navbar from "../../components/navbar/Navbar";
import Rodape from "../../components/rodape/Rodape";
import "./chat.css";

export default function Chat() {
  return (
    <>
      <Navbar />

      <main className="chat-page">
        <div className="chat-container">
          <header className="chat-header">
            <span className="chat-kicker">
              <FaComments /> Conversas
            </span>
            <h1>Converse com seus parceiros de reciclagem</h1>
            <p>
              Depois que um convite for aceito, a conversa ficará disponível
              aqui para vocês combinarem os detalhes da entrega.
            </p>
          </header>

          <section className="chat-empty" aria-labelledby="chat-empty-title">
            <span className="chat-empty-icon" aria-hidden="true">
              <FaPaperPlane />
            </span>
            <h2 id="chat-empty-title">Nenhuma conversa por aqui</h2>
            <p>
              Acompanhe seus convites e, quando uma solicitação for aceita,
              volte para iniciar a conversa.
            </p>
            <Link to="/convites" className="chat-empty-button">
              Ver meus convites
            </Link>
          </section>
        </div>
      </main>

      <Rodape />
    </>
  );
}
