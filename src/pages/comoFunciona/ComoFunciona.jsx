import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaImage,
  FaLink,
  FaPen,
  FaSmile,
  FaTimes,
  FaUpload,
  FaVideo as FaVideoClassic,
} from "react-icons/fa";
import {
  FaArrowRight,
  FaCircleQuestion,
  FaHandHoldingHeart,
  FaLeaf,
  FaRecycle,
  FaRegCircleCheck,
  FaTruckFast,
  FaVideo,
  FaXmark,
} from "react-icons/fa6";
import Navbar from "../../components/navbar/Navbar";
import Rodape from "../../components/rodape/Rodape";
import LogoRetrato from "../../assets/LogoRetrato.png";
import { useAuth } from "../../contexts/AuthContext";
import PetDicas from "../../assets/PetDicas.png";
import PetMateriais from "../../assets/PetMateriais.png";
import {
  artigosComunidade,
  extras,
  guias,
  perfis,
  videos as videosComunidade,
} from "./ComoFuncionaData";
import "./comoFunciona.css";

const tips = [
  "Amasse garrafas e caixas para economizar espaco.",
  "Separe vidro quebrado em embalagem resistente e sinalizada.",
  "Guarde oleo usado em garrafa bem fechada.",
  "Evite misturar papel limpo com restos de comida ou gordura.",
];

const mistakes = [
  {
    icon: FaXmark,
    title: "Guardanapos usados",
    text: "Papel sujo de gordura ou comida normalmente nao entra na reciclagem comum.",
  },
  {
    icon: FaXmark,
    title: "Esponjas e adesivos",
    text: "Materiais mistos, pequenos ou muito contaminados precisam de descarte orientado.",
  },
  {
    icon: FaXmark,
    title: "Ceramica e espelho",
    text: "Eles nao seguem o mesmo processo de garrafas e potes de vidro reciclavel.",
  },
];

const videos = [
  {
    title: "Coisas do dia a dia que nao podem ser recicladas",
    text: "Um guia rapido para evitar erros comuns na separacao dos materiais.",
    src: "https://www.youtube.com/embed/Ds6kLzGo1ps",
    duration: "educacao ambiental",
  },
  {
    title: "Como lavar reciclaveis",
    text: "Aprenda quando lavar, quanto lavar e como deixar embalagens prontas para coleta.",
    src: "https://www.youtube.com/embed/mQ95inY8dAc",
    duration: "preparo dos materiais",
  },
];

const impactCards = [
  {
    icon: FaLeaf,
    title: "Menos contaminacao",
    text: "Materiais limpos aumentam a chance de reaproveitamento.",
  },
  {
    icon: FaTruckFast,
    title: "Coleta mais certeira",
    text: "Coletores e centros recebem informacoes melhores antes da entrega.",
  },
  {
    icon: FaHandHoldingHeart,
    title: "Impacto social",
    text: "A plataforma aproxima quem separa de quem vive da reciclagem.",
  },
];

const featuredArticle = {
  title: "De onde vem o que voce recicla: uma visita aos centros parceiros",
  text: "Acompanhamos uma tarde na cooperativa Vida Verde para entender o que acontece com o material depois que ele sai da sua casa.",
};

const faqItems = [
  {
    question: "Quando preciso lavar uma embalagem?",
    answer:
      "Lave quando houver resto de alimento, oleo ou bebida. Nao precisa gastar muita agua: retirar o excesso ja ajuda bastante.",
  },
  {
    question: "O que fazer quando tenho duvida se um item recicla?",
    answer:
      "Confira o material principal, procure simbolos na embalagem e, se ainda houver duvida, cadastre ou consulte um parceiro antes de misturar com reciclaveis limpos.",
  },
  {
    question: "Como separar materiais pequenos ou mistos?",
    answer:
      "Itens muito pequenos, adesivos, embalagens laminadas e objetos com varios materiais juntos podem atrapalhar a triagem. Separe em uma sacola propria e confirme o destino ideal.",
  },
  {
    question: "Como deixar a entrega mais facil para coletores e centros?",
    answer:
      "Agrupe por tipo, informe quantidade aproximada, avise se ha vidro quebrado e mantenha o material seco. Isso reduz retrabalho e melhora a chance de aproveitamento.",
  },
];

function SectionHeader({ eyebrow, title, text, icon }) {
  return (
    <div className="comunidade-section-header">
      <span>
        {icon}
        {eyebrow}
      </span>
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  );
}

function CommunityArticleCard({ titulo, autor, tag, icone, cor }) {
  return (
    <article className={`comunidade-article-card comunidade-tone-${cor}`}>
      <div className="comunidade-mini-thumb">{icone}</div>
      <div>
        <h3>{titulo}</h3>
        <p>
          por <strong>{autor}</strong>
        </p>
        <span>{tag}</span>
      </div>
    </article>
  );
}

function MiniVideoCard({ titulo, duracao, icone, cor }) {
  return (
    <article className={`comunidade-mini-video-card comunidade-tone-${cor}`}>
      <div className="comunidade-mini-video-icon">
        {icone}
        <FaVideo />
      </div>
      <h3>{titulo}</h3>
      <span>{duracao}</span>
    </article>
  );
}

function GuideCard({ titulo, nivel, aulas, duracao, icone }) {
  return (
    <article className="comunidade-guide-card">
      <div className="comunidade-guide-header">
        <span>{icone}</span>
        <strong>{nivel}</strong>
      </div>
      <h3>{titulo}</h3>
      <p>
        {aulas} aulas - {duracao}
      </p>
      <div className="comunidade-guide-progress">
        <span />
      </div>
      <small>Crie uma conta para acompanhar seu progresso.</small>
    </article>
  );
}

function VideoCard({ title, text, src, duration }) {
  return (
    <article className="comunidade-video-card">
      <div className="comunidade-video-frame">
        <iframe
          src={src}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
      <div className="comunidade-video-body">
        <span>
          <FaVideo /> {duration}
        </span>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
    </article>
  );
}

function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`comunidade-faq-item${open ? " is-open" : ""}`}>
      <button
        type="button"
        className="comunidade-faq-summary"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        <span>{question}</span>
        <FaCircleQuestion className="comunidade-faq-icon" />
      </button>
      <div className="comunidade-faq-panel">
        <div className="comunidade-faq-panel-inner">
          <p>{answer}</p>
        </div>
      </div>
    </div>
  );
}

function PostComposer({
  user = { name: "Voce", initials: "VC" },
  onSubmit = () => {},
}) {
  const [mode, setMode] = useState("text");
  const [text, setText] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef(null);

  function isValidVideo(file) {
    return file && ["video/mp4", "video/quicktime"].includes(file.type);
  }

  function handleFile(file) {
    if (isValidVideo(file)) {
      setVideoFile(file);
    }
  }

  function handleDrop(event) {
    event.preventDefault();
    setDragging(false);
    handleFile(event.dataTransfer.files[0]);
  }

  const canSubmit =
    (mode === "text" && text.trim()) || (mode === "video" && videoFile);

  function handleSubmit() {
    if (!canSubmit) return;

    onSubmit({ mode, text, videoFile });
    setText("");
    setVideoFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <div className="composer">
      <div className="composer-header">
        <div className="composer-avatar">{user.initials}</div>

        {mode === "text" ? (
          <input
            type="text"
            placeholder="O que voce quer compartilhar?"
            value={text}
            onChange={(event) => setText(event.target.value)}
          />
        ) : (
          <p>Envie um video para a comunidade.</p>
        )}
      </div>

      <div className="composer-tabs">
        <button
          type="button"
          className={mode === "text" ? "active" : ""}
          onClick={() => setMode("text")}
        >
          <FaPen />
          Escrever
        </button>

        <button
          type="button"
          className={mode === "video" ? "active" : ""}
          onClick={() => setMode("video")}
        >
          <FaVideoClassic />
          Video
        </button>
      </div>

      {mode === "video" && (
        <div
          className={`composer-upload ${dragging ? "drag" : ""}`}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            hidden
            ref={fileInputRef}
            accept="video/mp4,video/quicktime"
            onChange={(event) => handleFile(event.target.files[0])}
          />

          {videoFile ? (
            <div className="composer-file">
              <FaVideoClassic />
              <span>{videoFile.name}</span>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setVideoFile(null);
                }}
                aria-label="Remover video"
              >
                <FaTimes />
              </button>
            </div>
          ) : (
            <>
              <FaUpload className="upload-icon" />
              <p>Arraste um video ou clique para selecionar.</p>
              <small>MP4 ou MOV - ate 500MB</small>
            </>
          )}
        </div>
      )}

      <div className="composer-footer">
        <div className="composer-tools">
          <FaImage />
          <FaLink />
          <FaSmile />
        </div>

        <button
          type="button"
          className="composer-submit"
          disabled={!canSubmit}
          onClick={handleSubmit}
        >
          Publicar
        </button>
      </div>
    </div>
  );
}

export default function ComoFunciona() {
  const { user } = useAuth();

  return (
    <>
      <Navbar />

      <main className="como-funciona">
        <section id="comunidade" className="comunidade">
          {user && (
            <section className="comunidade-composer-section">
              <PostComposer />
            </section>
          )}

          <section className="comunidade-learning-section comunidade-learning-main-section">
            <div className="comunidade-main-intro">
              <SectionHeader
                eyebrow="Como reciclar"
                icon={<FaRecycle />}
                title="Aprenda, prepare seus materiais e recicle com mais seguranca"
                text="Nesta pagina voce encontra dicas, relatos, videos, guias e respostas praticas para usar melhor o Recicla que Pontua no dia a dia."
              />
              <img src={PetDicas} alt="Mascote do Recicla que Pontua dando boas-vindas" />
            </div>

            <div className="comunidade-learning-layout">
              <aside className="comunidade-sidebar">
                <span className="comunidade-sidebar-label">Experiencias reais</span>
                <p>Historias enviadas por participantes do Recicla que Pontua.</p>

                <div className="comunidade-article-list">
                  {artigosComunidade.map((artigo) => (
                    <CommunityArticleCard key={artigo.titulo} {...artigo} />
                  ))}
                </div>
              </aside>

              <div className="comunidade-learning-main">
                <article className="comunidade-featured-card">
                  <div className="comunidade-featured-visual">
                    <FaLeaf />
                  </div>
                  <div>
                    <span>Reportagem</span>
                    <h3>{featuredArticle.title}</h3>
                    <p>{featuredArticle.text}</p>
                    <button type="button">
                      Ler materia completa <FaArrowRight />
                    </button>
                  </div>
                </article>

                <div className="comunidade-profile-grid">
                  {perfis.map((perfil) => (
                    <article key={perfil.id} className="comunidade-profile-card">
                      <span>{perfil.icone}</span>
                      <h3>{perfil.label}</h3>
                      <p>{perfil.resumo}</p>
                    </article>
                  ))}
                </div>
              </div>
            </div>

            <div className="comunidade-original-content-grid">
              <section>
                <div className="comunidade-mini-head">
                  <h3>Videos e aulas rapidas</h3>
                  <span>Acervo educativo</span>
                </div>
                <div className="comunidade-mini-video-grid">
                  {videosComunidade.map((video, index) => (
                    <MiniVideoCard key={`${video.titulo}-${index}`} {...video} />
                  ))}
                </div>
              </section>

              <section>
                <div className="comunidade-mini-head">
                  <h3>Guias</h3>
                  <span>Trilhas para evoluir</span>
                </div>
                <div className="comunidade-guide-grid">
                  {guias.map((guia) => (
                    <GuideCard key={guia.titulo} {...guia} />
                  ))}
                </div>
              </section>

              <section className="comunidade-extras-section">
                <div className="comunidade-mini-head">
                  <h3>Recursos extras</h3>
                  <span>Apoio rapido</span>
                </div>
                <div className="comunidade-extra-grid">
                  {extras.map((extra) => (
                    <article key={extra.titulo} className="comunidade-extra-card">
                      <span>{extra.icone}</span>
                      <h3>{extra.titulo}</h3>
                      <p>{extra.texto}</p>
                    </article>
                  ))}
                </div>
              </section>
            </div>
          </section>

          <section className="comunidade-prep-section">
            <div className="comunidade-prep-intro">
              <SectionHeader
                eyebrow="Antes de entregar"
                icon={<FaRegCircleCheck />}
                title="Pequenos cuidados que aumentam o valor do material"
                text="Separacao correta reduz rejeito, evita mau cheiro e ajuda centros e coletores a trabalharem com mais agilidade."
              />
              <img src={PetMateriais} alt="Mascote separando materiais reciclaveis" />
            </div>

            <div className="comunidade-prep-grid">
              <article className="comunidade-checklist-card">
                <h3>Checklist rapido</h3>
                <div className="comunidade-checklist">
                  {tips.map((tip) => (
                    <label key={tip}>
                      <input type="checkbox" />
                      <span>
                        <FaRegCircleCheck />
                        {tip}
                      </span>
                    </label>
                  ))}
                </div>
              </article>

              <article className="comunidade-mistakes-card">
                <span className="comunidade-card-label">Evite no descarte comum</span>
                <div className="comunidade-mistakes-list">
                  {mistakes.map((item) => (
                    <div key={item.title}>
                      <item.icon />
                      <div>
                        <h3>{item.title}</h3>
                        <p>{item.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            </div>
          </section>

          <section id="videos-reciclagem" className="comunidade-videos-section">
            <SectionHeader
              eyebrow="Videos"
              icon={<FaVideo />}
              title="Aprenda vendo exemplos reais"
              text="Conteudos curtos para entender o que pode ser reciclado, como limpar embalagens e como evitar os erros mais comuns."
            />

            <div className="comunidade-video-grid">
              {videos.map((video) => (
                <VideoCard key={video.title} {...video} />
              ))}
            </div>
          </section>

          <section className="comunidade-impact-section">
            <div className="comunidade-impact-text">
              <span>
                <FaRecycle /> Por que isso importa
              </span>
              <h2>Reciclar melhor melhora o resultado de todo mundo</h2>
              <p>
                Quando o material chega limpo, separado e com informacoes
                claras, a plataforma consegue conectar melhor pessoas
                recicladoras, coletores e centros de reciclagem.
              </p>
            </div>

            <div className="comunidade-impact-grid">
              {impactCards.map(({ icon: Icon, title, text }) => (
                <article key={title}>
                  <Icon />
                  <strong>{title}</strong>
                  <span>{text}</span>
                </article>
              ))}
            </div>
          </section>

          <section className="comunidade-faq-section">
            <div>
              <SectionHeader
                eyebrow="Na pratica"
                icon={<FaCircleQuestion />}
                title="Dicas para decidir o destino certo"
                text="Use estas regras simples antes de cadastrar seus materiais na plataforma."
              />

              <div className="comunidade-faq-list">
                {faqItems.map((item) => (
                  <FaqItem key={item.question} {...item} />
                ))}
              </div>
            </div>
          </section>

          <section className="comunidade-final-cta">
            <div className="comunidade-final-copy">
              <h2>Agora e so preparar os materiais e escolher o destino.</h2>
              <p>
                Use o que aprendeu aqui para deixar tudo limpo, separado e
                pronto para pontuar no Recicla que Pontua.
              </p>
            </div>
            <div className="comunidade-final-visual">
              <img src={LogoRetrato} alt="Mascote incentivando a preparar entrega" />
              <Link to="/doacao/cadastrar-materiais">
                Preparar entrega <FaArrowRight />
              </Link>
            </div>
          </section>
        </section>
      </main>

      <Rodape />
    </>
  );
}
