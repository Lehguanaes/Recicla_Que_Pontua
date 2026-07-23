import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import Rodape from "../../components/rodape/Rodape";
import {
  FaArrowRight,
  FaAward,
  FaBottleWater,
  FaBoxesStacked,
  FaBuilding,
  FaCheck,
  FaCircleQuestion,
  FaHouseChimney,
  FaLeaf,
  FaLocationDot,
  FaMedal,
  FaPeopleCarryBox,
  FaRecycle,
  FaScaleBalanced,
  FaSeedling,
  FaTruckFast,
  FaWineBottle,
} from "react-icons/fa6";
import { FaBoxOpen, FaFileAlt, FaOilCan } from "react-icons/fa";
import LogoRetrato from "../../assets/LogoRetrato.png";
import PetRecicla from "../../assets/PetRecicla.png";
import Coletor from "../../assets/catador.png";
import CentroColeta from "../../assets/centrocoleta.png";
import PetDuvidas from "../../assets/PetDuvidas.png";
import PetComecar from "../../assets/PetComecar.png";
import "./home.css";

const websiteFeatures = [
  {
    icon: FaBoxesStacked,
    title: "Cadastre seus recicláveis",
    text: "Informe plástico, vidro, papel, metal, papelão, óleo ou eletrônicos por unidade, litro ou kg.",
  },
  {
    icon: FaScaleBalanced,
    title: "Compare a melhor opção",
    text: "Veja quem aceita todos os materiais, quem paga melhor e quais parceiros ficam mais convenientes.",
  },
  {
    icon: FaMedal,
    title: "Pontue pelo impacto",
    text: "A entrega confirmada gera pontos, conquistas, ranking regional e estatísticas ambientais.",
  },
];

const steps = [
  {
    icon: FaHouseChimney,
    title: "Separe",
    text: "Organize os recicláveis por tipo e mantenha tudo limpo para facilitar a entrega.",
  },
  {
    icon: FaRecycle,
    title: "Cadastre",
    text: "Informe material, peso ou quantidade e veja uma prévia de pontos e impacto.",
  },
  {
    icon: FaLocationDot,
    title: "Conecte",
    text: "Escolha entre centros de reciclagem, unidades ou coletores disponíveis.",
  },
  {
    icon: FaAward,
    title: "Pontue",
    text: "Confirme a entrega, acompanhe seus pontos e evolua no ranking regional.",
  },
];

const materials = [
  {
    icon: FaBottleWater,
    name: "Plásticos",
    examples: "Garrafas PET, embalagens e tampas.",
    tip: "Enxágue e amasse para ocupar menos espaço.",
  },
  {
    icon: FaFileAlt,
    name: "Papel e papelão",
    examples: "Caixas, folhas, jornais e embalagens secas.",
    tip: "Evite molhar, pois umidade reduz o reaproveitamento.",
  },
  {
    icon: FaWineBottle,
    name: "Vidros",
    examples: "Garrafas, potes e frascos.",
    tip: "Proteja itens quebrados e sinalize para quem vai receber.",
  },
  {
    icon: FaBoxOpen,
    name: "Metais",
    examples: "Latas de alumínio, ferragens e sucatas.",
    tip: "Separe alumínio, ferro e cobre quando souber identificar.",
  },
  {
    icon: FaOilCan,
    name: "Óleo usado",
    examples: "Óleo de cozinha armazenado em garrafa.",
    tip: "Nunca descarte na pia; um litro pode contaminar muita água.",
  },
  {
    icon: FaBuilding,
    name: "Eletrônicos",
    examples: "Cabos, pequenos aparelhos e componentes.",
    tip: "Procure parceiros preparados para descarte tecnológico.",
  },
];

const partnerChoices = [
  {
    image: CentroColeta,
    title: "Centros de reciclagem",
    text: "Indicados para quem quer vender materiais, comparar preços e encontrar locais que aceitam tudo em uma entrega.",
    badge: "Maior valor pago",
  },
  {
    image: Coletor,
    title: "Coletores autônomos",
    text: "Ideais para descarte gratuito, coleta mais próxima e apoio direto a quem movimenta a reciclagem na cidade.",
    badge: "Entrega solidária",
  },
];

const audienceReasons = [
  {
    icon: FaHouseChimney,
    title: "Pessoa Recicladora",
    text: "Para quem quer reciclar em casa, encontrar um destino confiável e ganhar pontos por cada entrega confirmada.",
    highlight: "Recicle e pontue",
  },
  {
    icon: FaBuilding,
    title: "Unidade que Recicla",
    text: "Gestão mais simples para empresas, condomínios, escolas, lojas e pequenos negócios que acumulam materiais e precisam organizar o descarte.",
    highlight: "Iniciativas verdes",
  },
  {
    icon: FaTruckFast,
    title: "Coletor",
    text: "Para quem coleta materiais e quer receber solicitações mais claras, com tipos, volume e localização já informados.",
    highlight: "Praticidade e Coletas certeiras",
  },
  {
    icon: FaRecycle,
    title: "Centro de Reciclagem",
    text: "Para unidades compradoras divulgarem materiais aceitos, preços, horários e atraírem entregas mais qualificadas.",
    highlight: "Mais materiais chegando",
  },
];

const faqs = [
  {
    question: "Preciso pagar para usar o Recicla que Pontua?",
    answer:
      "Não! A ideia é facilitar a conexão entre pessoas, unidades, coletores e centros de reciclagem. Valores de compra são combinados entre as partes envolvidas (se houver).",
  },
  {
    question: "Quando devo escolher centro ou coletor?",
    answer:
      "Escolha centro quando quiser lucrar com os materiais. Escolha coletor quando quiser entregar gratuitamente e priorizar conveniência ou impacto social.",
  },
  {
    question: "Como os pontos entram na plataforma?",
    answer:
      "Depois que a entrega é confirmada, a plataforma pode registrar pontos para todos os envolvidos, concedendo medalhas, níveis no ranking e aumento das estatísticas de impacto ambiental.",
  },
  {
    question: "O site aceita vários materiais no mesmo cadastro?",
    answer:
      "Sim. Você pode registrar diferentes materiais e buscar parceiros que aceitam todos, evitando deslocamentos para vários lugares.",
  },
];

function SectionHeader({ eyebrow, title, text, icon }) {
  return (
    <div className="home-section-header">
      <span>
        {icon}
        {eyebrow}
      </span>
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, text }) {
  return (
    <article className="home-feature-card">
      <div className="home-card-icon">
        <Icon />
      </div>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}

function StepCard({ step, icon: Icon, title, text }) {
  return (
    <article className="home-step-card">
      <span className="home-step-number">{String(step).padStart(2, "0")}</span>
      <div className="home-step-icon">
        <Icon />
      </div>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}

function MaterialCard({ icon: Icon, name, examples, tip }) {
  return (
    <article className="home-material-card">
      <div>
        <Icon />
        <h3>{name}</h3>
      </div>
      <p>{examples}</p>
      <span>
        <FaCheck /> {tip}
      </span>
    </article>
  );
}

function PartnerCard({ image, title, text, badge }) {
  return (
    <article className="home-partner-card">
      <img src={image} alt="" aria-hidden="true" />
      <div>
        <span>{badge}</span>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
    </article>
  );
}

function AudienceCard({ icon: Icon, title, text, highlight }) {
  return (
    <article className="home-audience-card">
      <div className="home-audience-icon">
        <Icon />
      </div>
      <span>{highlight}</span>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}

function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`home-faq-item${open ? " is-open" : ""}`}>
      <button
        type="button"
        className="home-faq-summary"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        <span>{question}</span>
        <FaCircleQuestion className="home-faq-icon" />
      </button>
      <div className="home-faq-panel">
        <div className="home-faq-panel-inner">
          <p>{answer}</p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="home-page">
        <section className="home-hero">
          <div className="home-hero-content">
            <span className="home-kicker">
              <FaSeedling /> Reciclagem inteligente e recompensada
            </span>
            <h1>Recicle melhor, encontre parceiros e transforme descarte em pontos.</h1>
            <p>
              O Recicla que Pontua conecta quem tem materiais recicláveis em
              casa, condomínios e pequenos comércios com coletores e centros de
              reciclagem. Cada entrega confirmada ajuda você a subir no ranking,
              liberar medalhas e acompanhar o impacto ambiental gerado.
            </p>

            <div className="home-hero-actions">
              <Link className="home-primary-button" to="/doacao/cadastrar-materiais">
                Cadastrar materiais <FaArrowRight />
              </Link>
              <Link className="home-secondary-button" to="/como-reciclar">
                Ver como reciclar
              </Link>
            </div>

          </div>

          <div className="home-hero-visual" aria-label="Ilustração da plataforma">
            <img src={LogoRetrato} alt="Recicla que Pontua" />
          </div>
        </section>

        <section className="home-explanation">
          <SectionHeader
            eyebrow="O que é o site"
            icon={<FaRecycle />}
            title="Um intermediador entre quem separa e quem recicla"
            text="A plataforma organiza materiais, preferências e parceiros para que o descarte deixe de ser confuso e vire uma escolha simples."
          />

          <div className="home-feature-grid">
            {websiteFeatures.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </section>

        <section className="home-audience-section">
          <SectionHeader
            eyebrow="Por que usar"
            icon={<FaPeopleCarryBox />}
            title="Quem se beneficia com a plataforma?"
            text="Cada perfil entra na plataforma com uma necessidade diferente, mas todos ganham com uma reciclagem mais organizada, rastreável e recompensada."
          />

          <div className="home-audience-grid">
            {audienceReasons.map((reason) => (
              <AudienceCard key={reason.title} {...reason} />
            ))}
          </div>
        </section>
                <section className="home-partners-section">
          <SectionHeader
            eyebrow="Escolha consciente"
            icon={<FaScaleBalanced />}
            title="Lucrar ou doar: o destino muda conforme seu objetivo"
            text="O sistema ajuda a filtrar o tipo de parceiro ideal para cada situação, sem obrigar você a visitar vários locais."
          />

          <div className="home-partner-grid">
            {partnerChoices.map((partner) => (
              <PartnerCard key={partner.title} {...partner} />
            ))}
          </div>
        </section>

        <section className="home-gamification">
          <div className="home-gamification-text">
            <span>
              <FaMedal />
              Gamificação
            </span>
            <h2>Reciclar também vira conquista</h2>
            <p>
              Pontos, medalhas, ranking regional e estatísticas de impacto
              ambiental ajudam pessoas recicladoras, coletores e unidades a
              acompanharem sua evolução.
            </p>
            <Link to="/ranking">
              Conhecer ranking <FaArrowRight />
            </Link>
          </div>
          <div className="home-gamification-panel">
            <div>
              <FaLeaf />
              <strong>Impacto ambiental</strong>
              <span>Estimativas de plástico, água e energia economizada.</span>
            </div>
            <div>
              <FaMedal />
              <strong>Medalhas</strong>
              <span>Conquistas por frequência, volume e diversidade.</span>
            </div>
            <div>
              <FaPeopleCarryBox />
              <strong>Ranking regional</strong>
              <span>Destaque para recicladores e unidades parceiras.</span>
            </div>
          </div>
        </section>


        <section className="home-flow-section">
          <SectionHeader
            eyebrow="Passo a passo"
            icon={<FaAward />}
            title="Como sair do material parado para os pontos"
            text="O caminho é curto: separar, cadastrar, escolher o melhor destino e confirmar a entrega para pontuar."
          />

          <div className="home-step-grid">
            {steps.map((step, index) => (
              <StepCard key={step.title} step={index + 1} {...step} />
            ))}
          </div>
        </section>

        <section className="home-materials-section">
          <div className="home-materials-intro">
            <SectionHeader
              eyebrow="Aprenda a separar"
              icon={<FaLeaf />}
              title="Materiais recicláveis que podem ganhar novo destino"
              text="Separar corretamente aumenta as chances de venda, evita contaminação e ajuda centros e coletores a trabalharem melhor."
            />
            <img src={PetRecicla} alt="Pet separando materiais recicláveis" />
          </div>

          <div className="home-material-grid">
            {materials.map((material) => (
              <MaterialCard key={material.name} {...material} />
            ))}
          </div>
        </section>

        <section className="home-faq-section">
          <div className="home-faq-layout">
            <div>
              <SectionHeader
                eyebrow="Perguntas frequentes"
                icon={<FaCircleQuestion />}
                title="Dúvidas comuns antes de começar"
                text="As respostas essenciais para usar a plataforma com segurança e entender a proposta."
              />

              <div className="home-faq-list">
                {faqs.map((faq) => (
                  <FaqItem key={faq.question} {...faq} />
                ))}
              </div>
            </div>

            <img
              className="home-faq-pet"
              src={PetDuvidas}
              alt="Mascote tirando dúvidas sobre reciclagem"
            />
          </div>
        </section>

        <section className="home-final-cta">
          <img src={PetComecar} alt="Mascote incentivando a começar a reciclar" />
          <div>
            <h2>Pronto para dar destino certo aos seus recicláveis?</h2>
            <p>
              Cadastre os materiais, compare parceiros e comece a pontuar pelo
              impacto que você já pode gerar hoje.
            </p>
          </div>
          <Link to="/doacao/cadastrar-materiais">
            Começar agora <FaArrowRight />
          </Link>
        </section>
      </main>

      <Rodape />
    </>
  );
}
