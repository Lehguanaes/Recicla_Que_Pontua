import Navbar from "../../components/navbar/Navbar";
import Rodape from "../../components/rodape/Rodape";
import './ranking.css';
import { useMemo, useState } from "react";
import {FaTrophy,FaRecycle,FaUsers,FaArrowUp,FaArrowDown,FaMinus,FaChevronDown,FaPaw,} from "react-icons/fa";
import {useAuth} from '../../contexts/AuthContext';
import {
  USUARIOS_MOCK,
  ID_USUARIO_LOGADO,
  FILTROS,calcularRanking,calcularEstatisticas,calcularPosicaoUsuario,
} from "../../utils/RankingMock";
import Mascote from "../../assets/PetComecar.png";

const LABEL_TIPO = {
  pessoa: "Pessoa Recicladora",
  instituicao: "Instituição Recicladora",
  coletor: "Coletor",
};

const MEDALHA = ["🥇", "🥈", "🥉"];

function falaDoMascote(posicao) {
  if (!posicao) return "Comece a reciclar pra entrar no ranking!";
  if (posicao === 1) return "Uau, você é o Top 1! Continue assim!";
  if (posicao <= 3) return "Você tá no pódio! Falta pouco pro topo!";
  if (posicao <= 10) return "Tá quase no Top 5, vai que dá!";
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
      "Cadastre materiais com frequência, entregue no local e prazo combinados, e mantenha boas avaliações nas suas trocas. Pontos consistentes ao longo do tempo pesam mais do que um único envio grande.",
  },
  {
    pergunta: "Se eu receber uma avaliação ruim, eu desço muito no ranking?",
    resposta:
      "Uma avaliação ruim isolada tem impacto pequeno. O que realmente derruba a posição é um padrão repetido de avaliações baixas, então uma experiência única abaixo do esperado não vai te tirar do topo.",
  },
  {
    pergunta: "Com que frequência o ranking é atualizado?",
    resposta:
      "O ranking é recalculado automaticamente sempre que você ganha pontos, ou seja, ele reflete quase em tempo real suas reciclagens e trocas mais recentes.",
  },
  {
    pergunta: "O ranking reseta em algum momento?",
    resposta:
      "Por enquanto o ranking é acumulativo, sem reset por mês ou ano. Se isso mudar (por exemplo, um ranking mensal com recompensas próprias), você verá o aviso aqui mesmo.",
  },
];

export default function Ranking() {
  const [filtro, setFiltro] = useState("geral");
  const [faqAberta, setFaqAberta] = useState(null);
  const { user } = useAuth();

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

        <div className="ranking-hero">
          <div className="ranking-hero-texto">
            <h1 className="ranking-title">
              <FaTrophy size={26} />
              Ranking
            </h1>
            <p className="ranking-subtitle">
              Veja quem está reciclando mais e suba de posição.
            </p>
          </div>

          <div className="ranking-mascote">
            <div className="mascote-fala">{falaDoMascote(usuarioLogado?.posicao)}</div>
            <img src={Mascote} alt="Reci, o mascote, torcendo por você" />
          </div>
        </div>

        {/* Cards de destaque */}
        <div className="cards-ranking">
          <CardDestaque
            icone={<FaTrophy size={20} />}
            label="Líder"
            valorPrincipal={stats.lider?.nome}
            valorSecundario={`${stats.lider?.pontos.toLocaleString("pt-BR")} pts`}
            destaque
          />
          <CardDestaque
            icone={<FaRecycle size={20} />}
            label="Total reciclado"
            valorPrincipal={`${stats.totalRecicladoKg.toLocaleString("pt-BR")} kg`}
          />
          <CardDestaque
            icone={<FaUsers size={20} />}
            label="Participantes"
            valorPrincipal={`${stats.totalParticipantes} usuários`}
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
          <div className="usuario-ranking">
            <div className="usuario-ranking-posicao">
              <p className="usuario-ranking-label">
                Quer aparecer no ranking?
              </p>
              <p className="usuario-ranking-valor">
              Crie sua conta e comece a acumular pontos!
              </p>
            </div>
          </div>
        )}

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

        {/* Perguntas frequentes */}
        <div className="faq-ranking">
          <h2 className="faq-titulo">
            <FaPaw />
            Perguntas frequentes sobre o ranking
          </h2>

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
        </div>
      </div>

      <Rodape />
    </>
  );
}

function CardDestaque({ icone, label, valorPrincipal, valorSecundario, destaque }) {
  return (
    <div className={`card-ranking ${destaque ? "card-ranking-destaque" : ""}`}>
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
      <button className="faq-pergunta" onClick={onClick}>
        {item.pergunta}
        <FaChevronDown className="faq-chevron" />
      </button>
      {aberta && <p className="faq-resposta">{item.resposta}</p>}
    </div>
  );
}
