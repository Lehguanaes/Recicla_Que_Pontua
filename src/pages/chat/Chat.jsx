import { FaComments, FaPaperPlane } from "react-icons/fa";
import Navbar from "../../components/navbar/Navbar";
import Rodape from "../../components/rodape/Rodape";
import { PageHeader } from "../../components/typography/Typography";
import EmptyState from "../../components/common/EmptyState";
import Button from "../../components/button/Button";
import "./chat.css";

export default function Chat() {
  return (
    <>
      <Navbar />

      <main className="chat-page">
        <div className="chat-container">
          <PageHeader
            className="chat-header"
            eyebrowClassName="chat-kicker"
            eyebrow="Conversas"
            icon={<FaComments />}
            title="Converse com seus parceiros de reciclagem"
            text="Depois que um convite for aceito, a conversa ficará disponível aqui para vocês combinarem os detalhes da entrega."
          />

          <EmptyState
            as="section"
            className="chat-empty"
            title="Nenhuma conversa por aqui"
            titleId="chat-empty-title"
            text="Acompanhe seus convites e, quando uma solicitação for aceita, volte para iniciar a conversa."
            icon={<FaPaperPlane />}
            iconClassName="chat-empty-icon"
          >
            <Button variant="green" to="/convites" className="chat-empty-button">
              Ver meus convites
            </Button>
          </EmptyState>
        </div>
      </main>

      <Rodape />
    </>
  );
}
