import Navbar from "../../components/navbar/Navbar";
import Rodape from "../../components/rodape/Rodape";
import './ranking.css';
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import {
  FaTrophy,
  FaRecycle,
  FaUsers,
  FaArrowUp,
  FaArrowDown,
  FaMinus,
  FaPaw,
} from "react-icons/fa";
import { FaCircleQuestion } from "react-icons/fa6";
import {useAuth} from '../../contexts/AuthContext';
import {
  USUARIOS_MOCK,
  ID_USUARIO_LOGADO,
  FILTROS,calcularRanking,calcularEstatisticas,calcularPosicaoUsuario,
} from "../../utils/RankingMock";
import Mascote from "../../assets/PetCampeao.png";
import Mascote2 from "../../assets/PetComecar.png"
const LABEL_TIPO = {
  pessoa: "Pessoa recicladora",
  instituicao: "Instituição recicladora",
  coletor: "Coletor",
};

const MEDALHA = ["🥇", "🥈", "🥉"];

function falaDoMascote(posicao) {
  if (!posicao) return "Comece a reciclar para entrar no ranking!";
  if (posicao === 1) return "Uau, você está em 1º lugar! Continue assim!";
  if (posicao <= 3) return "Você está no pódio! Falta pouco para chegar ao topo!";
  if (posicao <= 10) return "Está quase entre os cinco primeiros. Continue assim!";
  return "Recicle mais um pouco e suba de posição!";
}

const FAQ_ITEMS = [
  {
    pergunta: "Quais materiais rendem mais pontos?",
    resposta:
      "Materiais que exigem coleta mais especializada, como eletrônicos, óleo de cozinha usado e pilhas/baterias, costumam valer mais pontos do que papel ou plástico comum. Confira o valor de cada material na tela de Reciclar antes de cadastrar sua entrega.",
  },
  {
    pergunta: "Como faço para subir no ranking?",
    resposta:
      "Cadastre materiais com frequência, entregue-os no local e no prazo combinados e mantenha boas avaliações nas suas trocas. A constância ao longo do tempo conta mais do que um único envio grande.",
  },
  {
    pergunta: "Se eu receber uma avaliação ruim, eu desço muito no ranking?",
    resposta:
      "Uma avaliação ruim isolada tem pouco impacto. O que realmente reduz sua posição é um padrão de avaliações baixas; portanto, uma única experiência abaixo do esperado não o retirará do topo.",
  },
  {
    pergunta: "Com que frequência o ranking é atualizado?",
    resposta:
      "O ranking é recalculado automaticamente sempre que você ganha pontos. Assim, ele reflete quase em tempo real suas reciclagens e trocas mais recentes.",
  },
  {
    pergunta: "O ranking é zerado em algum momento?",
    resposta:
      "Por enquanto, o ranking é acumulativo e não é zerado mensal ou anualmente. Se isso mudar — por exemplo, com um ranking mensal e recompensas próprias —, você verá o aviso aqui mesmo.",
  },
];

function SectionHeader({ eyebrow, title, text, icon }) {
  return (
    <div className="ranking-section-header">
      <span>
        {icon}
        {eyebrow}
      </span>
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  );
}

export default function Ranking() {
  const [filtro, setFiltro] = useState("geral");
  const [faqAberta, setFaqAberta] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  // Em produção, troque USUARIOS_MOCK por dados vindos do Firestore (useEffect + onSnapshot / getDocs)
  const ranking = useMemo(() => calcularRanking(USUARIOS_MOCK, filtro), [filtro]);
  const stats = useMemo(() => calcularEstatisticas(USUARIOS_MOCK), []);
  const usuarioLogado = useMemo(
    () => calcularPosicaoUsuario(USUARIOS_MOCK, ID_USUARIO_LOGADO),
    []
  );

  return (
    <>
      <Navbar />

      <div className="ranking-container">
        <div className="ranking-bg-decor" aria-hidden="true">
          <FaRecycle className="decor-icon decor-icon-1" />
          <FaRecycle className="decor-icon decor-icon-2" />
          <FaPaw className="decor-icon decor-icon-3" />
          <FaPaw className="decor-icon decor-icon-4" />
        </div>

        <section className="ranking-hero-section">
          <div className="ranking-hero">
            <div className="ranking-hero-texto">
            <SectionHeader
              eyebrow="Ranking"
              icon={<FaTrophy />}
              title="Quem está liderando a reciclagem?"
              text="Acompanhe os destaques da comunidade e veja como sua reciclagem se compara com a de outros participantes."
            />
            </div>

            {user && usuarioLogado && (
               <div className="ranking-mascote">  
               <div className="mascote-fala">{falaDoMascote(usuarioLogado?.posicao)}</div>
                <img
                  className="pet-floating"
                  src={Mascote2}
                  alt="Reci, o mascote, torcendo por você"
                />
              </div>
           )}
             {!user && (
              <div className="ranking-mascote">
                <img
                  className="pet-floating"
                  src={Mascote}
                  alt="Reci, o mascote, torcendo por você"
                />
              </div>
            )}
          </div>


          {/* Cards de destaque */}
          <div className="cards-ranking">
            <CardDestaque
              icone={<FaTrophy size={20} />}
              label="Líder"
              valorPrincipal={stats.lider?.nome}
              valorSecundario={`${stats.lider?.pontos.toLocaleString("pt-BR")} pontos`}
              destaque
            />
            <CardDestaque
              icone={<FaRecycle size={20} />}
              label="Total reciclado"
              valorPrincipal={`${stats.totalRecicladoKg.toLocaleString("pt-BR")} kg`}
              className="card-ranking-verde"
            />
            <CardDestaque
              icone={<FaUsers size={20} />}
              label="Participantes"
              valorPrincipal={`${stats.totalParticipantes} usuários`}
              className="card-ranking-azul"
            />
          </div>

          {/* Card "você está em Xº lugar" */}
          {user && usuarioLogado && (
            <div className="usuario-ranking">
              <div className="usuario-ranking-posicao">
                <p className="usuario-ranking-label">Você está em</p>
                <p className="usuario-ranking-valor">🏅 {usuarioLogado.posicao}º lugar</p>
              </div>
              <div className="usuario-ranking-variacao">
                <VariacaoPosicao valor={usuarioLogado.variacaoPosicoes} />
                <p className="usuario-ranking-pontos-semana">
                  +{usuarioLogado.pontosGanhosSemana} pontos nesta semana
                </p>
              </div>
            </div>
          )}
          {!user && (
            <div className="usuario-ranking usuario-ranking-cta">
              <div className="usuario-ranking-posicao">
                <p className="usuario-ranking-label">
                  Quer aparecer no ranking?
                </p>
                <p className="usuario-ranking-valor">
                  Crie sua conta e comece a acumular pontos!
                </p>
                <p className="usuario-ranking-texto">
                  Cadastre seus materiais recicláveis, confirme entregas e
                  suba de posição junto com a comunidade.
                </p>
              </div>
              <Link to="/cadastro" className="usuario-ranking-cta-btn">
                Criar conta
              </Link>
            </div>
          )}
        </section>

        <section className="ranking-table-section">
          <SectionHeader
            eyebrow="Classificação"
            icon={<FaUsers />}
            title="Ranking completo de pontuação"
            text="Filtre por período e veja a posição de todos os participantes da plataforma."
          />

          {/* Filtros */}
          <div className="filtros-ranking">
            {FILTROS.map((f) => (
              <button
                key={f.chave}
                onClick={() => setFiltro(f.chave)}
                className={`filtro-btn ${filtro === f.chave ? "active" : ""}`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Tabela */}
          <div className="tabela-ranking">
            <table>
              <thead>
                <tr>
                  <th>Posição</th>
                  <th>Nome</th>
                  <th>Tipo</th>
                  <th>Pontos</th>
                </tr>
              </thead>
              <tbody>
                {ranking.map((usuario) => (
                  <tr
                    key={usuario.id}
                    className={user && usuario.id === ID_USUARIO_LOGADO ? "usuario-logado" : ""}                >
                    <td className="medalha">
                      {usuario.posicao <= 3 ? MEDALHA[usuario.posicao - 1] : `${usuario.posicao}º`}
                    </td>
                    <td>
                      {usuario.nome}
                        {user && usuario.id === ID_USUARIO_LOGADO && (
                        <span className="usuario-badge">você</span>
                      )}
                    </td>
                    <td>{LABEL_TIPO[usuario.tipo]}</td>
                    <td className="pontos">{usuario.pontos.toLocaleString("pt-BR")} pts</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Perguntas frequentes */}
        <section className="ranking-faq-section">
          <SectionHeader
            eyebrow="Dúvidas"
            icon={<FaCircleQuestion />}
            title="Perguntas frequentes sobre o ranking"
            text="Tudo o que você precisa saber para entender os pontos, as posições e o funcionamento do ranking."
          />

          <div className="faq-lista">
            {FAQ_ITEMS.map((item, index) => (
              <FaqItem
                key={item.pergunta}
                item={item}
                aberta={faqAberta === index}
                onClick={() => setFaqAberta(faqAberta === index ? null : index)}
              />
            ))}
          </div>
        </section>
      </div>

      <Rodape />
    </>
  );
}

function CardDestaque({ icone, label, valorPrincipal, valorSecundario, destaque, className }) {
  return (
    <div className={`card-ranking ${destaque ? "card-ranking-destaque" : ""} ${className || ""}`}>
      <div className="card-ranking-top">
        {icone}
        {label}
      </div>
      <p className="card-ranking-valor">{valorPrincipal}</p>
      {valorSecundario && <p className="card-ranking-sub">{valorSecundario}</p>}
    </div>
  );
}

function VariacaoPosicao({ valor }) {
  if (valor > 0) {
    return (
      <p className="subiu">
        <FaArrowUp size={16} /> subiu {valor} {valor === 1 ? "posição" : "posições"}
      </p>
    );
  }
  if (valor < 0) {
    return (
      <p className="caiu">
        <FaArrowDown size={16} /> caiu {Math.abs(valor)} {Math.abs(valor) === 1 ? "posição" : "posições"}
      </p>
    );
  }
  return (
    <p className="neutro">
      <FaMinus size={16} /> sem mudança
    </p>
  );
}

function FaqItem({ item, aberta, onClick }) {
  return (
    <div className={`faq-item ${aberta ? "faq-item-aberta" : ""}`}>
      <button
        className="faq-pergunta"
        onClick={onClick}
        aria-expanded={aberta}
      >
        {item.pergunta}
        <FaCircleQuestion className="faq-chevron" />
      </button>
      <div className="faq-panel">
        <div className="faq-panel-inner">
          <p className="faq-resposta">{item.resposta}</p>
        </div>
      </div>
    </div>
  );
}
