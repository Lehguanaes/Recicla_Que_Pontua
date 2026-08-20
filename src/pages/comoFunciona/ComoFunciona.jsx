import { useEffect, useRef, useState } from "react";
import {
  FaImage,
  FaLink,
  FaPaperPlane,
  FaPen,
  FaSmile,
  FaTimes,
} from "react-icons/fa";
import {
  FaArrowRight,
  FaHandHoldingHeart,
  FaLeaf,
  FaRecycle,
  FaRegCircleCheck,
  FaTruckFast,
  FaVideo,
  FaXmark,
} from "react-icons/fa6";
import PageLayout from "../../components/layout/PageLayout";
import Alert from "../../components/alert/Alert";
import { SectionHeader } from "../../components/typography/Typography";
import Button from "../../components/button/Button";
import IconButton from "../../components/button/IconButton";
import FormMessage from "../../components/form/FormMessage";
import LogoRetrato from "../../assets/LogoRetrato.png";
import { useAuth } from "../../contexts/AuthContext";
import PetDicas from "../../assets/PetDicas.png";
import PetBlog from "../../assets/PetBlog.png";
import PetMateriais from "../../assets/PetMateriais.png";
import {
  createBlogContribution,
  subscribeToBlogContributions,
} from "../../services/blogContributionService";
import {
  getGuideProgress,
  saveGuideProgress,
} from "../../services/guideProgressService";
import {
  extras,
  guias,
  perfis,
} from "./ComoFuncionaData";
import "./comoFunciona.css";

const tips = [
  "Amasse garrafas e caixas para economizar espaço.",
  "Separe vidro quebrado em embalagem resistente e sinalizada.",
  "Guarde óleo usado em uma garrafa bem fechada.",
  "Evite misturar papel limpo com restos de comida ou gordura.",
];

const mistakes = [
  {
    icon: FaXmark,
    title: "Guardanapos usados",
    text: "Papel sujo de gordura ou comida normalmente não entra na reciclagem comum.",
  },
  {
    icon: FaXmark,
    title: "Esponjas e adesivos",
    text: "Materiais mistos, pequenos ou muito contaminados precisam de descarte orientado.",
  },
  {
    icon: FaXmark,
    title: "Cerâmica e espelho",
    text: "Eles não seguem o mesmo processo de garrafas e potes de vidro reciclável.",
  },
];

const videos = [
  {
    title: "Coisas do dia a dia que não podem ser recicladas",
    text: "Um guia rápido para evitar erros comuns na separação dos materiais.",
    src: "https://www.youtube.com/embed/Ds6kLzGo1ps",
    duration: "educação ambiental",
  },
  {
    title: "Como lavar recicláveis",
    text: "Aprenda quando lavar, quanto lavar e como deixar embalagens prontas para coleta.",
    src: "https://www.youtube.com/embed/mQ95inY8dAc",
    duration: "preparo dos materiais",
  },
];

const impactCards = [
  {
    icon: FaLeaf,
    title: "Menos contaminação",
    text: "Materiais limpos aumentam a chance de reaproveitamento.",
  },
  {
    icon: FaTruckFast,
    title: "Coleta mais certeira",
    text: "Coletores e centros recebem informações melhores antes da entrega.",
  },
  {
    icon: FaHandHoldingHeart,
    title: "Impacto social",
    text: "A plataforma aproxima quem separa de quem vive da reciclagem.",
  },
];

const featuredArticle = {
  title: "Para onde vai o que você recicla? O caminho depois da coleta",
  text: "Da separação em casa à transformação na indústria: entenda o que pode acontecer com o material depois da entrega.",
  readingTime: "Leitura de 4 minutos",
  introduction:
    "Separar o material é o começo de um percurso que envolve coleta, conferência, triagem, armazenamento e transformação. Conhecer essas etapas ajuda a entender por que materiais limpos, secos e bem identificados têm mais chance de voltar à cadeia produtiva.",
  sections: [
    {
      title: "1. Coleta e recebimento",
      text: "Depois de sair da sua casa, o reciclável pode seguir para um coletor, uma cooperativa, um centro de triagem ou um ponto de entrega. No recebimento, os materiais são conferidos e, dependendo da estrutura do local, podem ser pesados e registrados por categoria.",
    },
    {
      title: "2. Triagem por tipo e qualidade",
      text: "Na triagem, papel, plástico, vidro e metal são separados. Alguns locais também dividem os plásticos por tipo de resina e os metais por composição. Materiais sujos, molhados, misturados ou não aceitos podem virar rejeito, pois comprometem a segurança e a qualidade do lote.",
    },
    {
      title: "3. Preparação para o transporte",
      text: "Depois de separados, os materiais podem ser prensados em fardos, triturados ou armazenados em recipientes próprios. Essa preparação reduz o volume, facilita o transporte e organiza a venda ou o envio para empresas recicladoras.",
    },
    {
      title: "4. Transformação em matéria-prima",
      text: "Na indústria, cada material passa por um processo diferente. Papéis podem voltar a ser polpa de celulose; plásticos podem ser lavados e transformados em pequenos grãos; vidros e metais podem ser fundidos para originar novos produtos.",
    },
    {
      title: "5. Nem tudo que parece reciclável será reciclado",
      text: "A possibilidade de reciclagem depende da composição, do estado do material, da tecnologia disponível e da procura por aquela matéria-prima. Por isso, o símbolo de reciclagem não garante sozinho que o item será aceito. Antes de entregar, confirme as regras do coletor ou centro escolhido.",
    },
  ],
  closing:
    "Quando você esvazia as embalagens, retira o excesso de sujeira, mantém os materiais secos e informa corretamente o que está entregando, reduz perdas e facilita o trabalho de toda a cadeia da reciclagem.",
};

const BLOG_EMOJIS = ["♻️", "🌱", "🌎", "💚", "✨", "👏", "💡", "📦"];
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_IMAGE_SIZE = 600 * 1024;
const ALL_AUDIENCES_ID = "todos";

function getAudienceLabel(audienceId) {
  if (audienceId === ALL_AUDIENCES_ID) return "Todos os perfis";
  return perfis.find((perfil) => perfil.id === audienceId)?.label || "Todos os perfis";
}

function getDefaultAudience(user) {
  return perfis.some((perfil) => perfil.id === user?.perfil)
    ? user.perfil
    : ALL_AUDIENCES_ID;
}

function normalizeLink(value) {
  const trimmedValue = value.trim();
  if (!trimmedValue) return "";

  try {
    const url = new URL(
      /^https?:\/\//i.test(trimmedValue)
        ? trimmedValue
        : `https://${trimmedValue}`
    );

    return ["http:", "https:"].includes(url.protocol) ? url.toString() : "";
  } catch {
    return "";
  }
}

function getSubmissionErrorMessage(error) {
  const code = error?.code || "";

  if (code.includes("permission-denied") || code.includes("unauthorized")) {
    return "O Firebase ainda não autorizou o envio. Verifique a permissão de criação da coleção blog no Firestore.";
  }

  if (code.includes("timeout") || code.includes("retry-limit-exceeded")) {
    return "O envio demorou mais que o esperado. Confira sua conexão e tente novamente.";
  }

  if (code.includes("canceled")) {
    return "O envio do arquivo foi interrompido. Tente novamente.";
  }

  return "Não foi possível enviar sua contribuição. Confira sua conexão e tente novamente.";
}

function getContributionTitle(contribution) {
  const text = contribution.texto?.trim();

  if (!text) {
    return contribution.imagem
      ? "Uma imagem compartilhada com a comunidade"
      : "Um conteúdo compartilhado com a comunidade";
  }

  const firstLine = text.split(/\n|[.!?]\s/)[0];
  return firstLine.length > 66 ? `${firstLine.slice(0, 63).trim()}...` : firstLine;
}

function CommunityArticleCard({ contribution, onOpen }) {
  const authorName = contribution.autorNome?.trim() || "Participante";
  const authorInitials = authorName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <article className="comunidade-article-card">
      <button
        type="button"
        className="comunidade-article-card-toggle"
        onClick={() => onOpen(contribution)}
      >
        <div className="comunidade-mini-thumb">
          {contribution.autorFoto ? (
            <img src={contribution.autorFoto} alt="" />
          ) : (
            <span>{authorInitials}</span>
          )}
        </div>
        <div className="comunidade-article-meta">
          <h3>{getContributionTitle(contribution)}</h3>
          <p>
            por <strong>{authorName}</strong>
          </p>
          <small className="comunidade-article-read">Ler experiência</small>
        </div>
        <FaArrowRight className="comunidade-article-chevron" aria-hidden="true" />
      </button>
    </article>
  );
}

function GuideCard({ guide, completedLessons, user, onOpen }) {
  const completedCount = completedLessons.length;
  const progress = Math.round((completedCount / guide.aulas.length) * 100);

  return (
    <button
      type="button"
      className="comunidade-guide-card"
      onClick={() => onOpen(guide)}
    >
      <div className="comunidade-guide-header">
        <span>{guide.icone}</span>
        <strong>{guide.nivel}</strong>
      </div>
      <h3>{guide.titulo}</h3>
      <p>{guide.resumo}</p>
      <p>
        {guide.aulas.length} etapas • {guide.duracao}
      </p>
      <div
        className="comunidade-guide-progress"
        role="progressbar"
        aria-label={`Progresso em ${guide.titulo}`}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow={progress}
      >
        <span style={{ width: `${progress}%` }} />
      </div>
      <small>
        {user
          ? completedCount
            ? `${completedCount} de ${guide.aulas.length} etapas concluídas`
            : "Começar aula"
          : "Abra para estudar • entre para salvar"}
      </small>
      <span className="comunidade-guide-open">
        {completedCount ? "Continuar aula" : "Abrir aula"} <FaArrowRight />
      </span>
    </button>
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

function PostComposer({ user, onPublished }) {
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [link, setLink] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [formError, setFormError] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [audience, setAudience] = useState(() => getDefaultAudience(user));
  const imageInputRef = useRef(null);
  const textInputRef = useRef(null);
  const profileName = user?.nome?.trim() || "Você";
  const profileInitials = profileName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  const normalizedLink = normalizeLink(link);
  const canSubmit = Boolean(text.trim() || imagePreview || normalizedLink);

  function handleImage(file) {
    if (!file) return;

    if (!IMAGE_TYPES.includes(file.type)) {
      setFormError("Escolha uma imagem JPG, PNG, WebP ou GIF.");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setFormError("A imagem deve ter no máximo 600 KB.");
      return;
    }

    setFormError("");
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.onerror = () => {
      setImageFile(null);
      setFormError("Não foi possível ler a imagem selecionada.");
    };
    reader.readAsDataURL(file);
  }

  function removeImage() {
    setImageFile(null);
    setImagePreview("");
    if (imageInputRef.current) imageInputRef.current.value = "";
  }

  function insertEmoji(emoji) {
    const input = textInputRef.current;
    const start = input?.selectionStart ?? text.length;
    const end = input?.selectionEnd ?? text.length;
    const nextText = `${text.slice(0, start)}${emoji}${text.slice(end)}`;

    setText(nextText);
    setShowEmojiPicker(false);

    requestAnimationFrame(() => {
      input?.focus();
      input?.setSelectionRange(start + emoji.length, start + emoji.length);
    });
  }

  function requestConfirmation() {
    if (link.trim() && !normalizedLink) {
      setFormError("Digite um link válido antes de continuar.");
      return;
    }

    if (!canSubmit) {
      setFormError("Escreva uma mensagem ou adicione uma imagem ou link.");
      return;
    }

    setFormError("");
    setConfirmOpen(true);
  }

  function resetComposer() {
    setText("");
    removeImage();
    setLink("");
    setShowLinkInput(false);
    setShowEmojiPicker(false);
  }

  async function submitContribution() {
    if (!user?.uid) {
      setConfirmOpen(false);
      setFormError("Entre na sua conta para enviar uma contribuição.");
      return;
    }

    setSubmitting(true);

    try {
      await createBlogContribution({
        autorId: user.uid,
        autorNome: profileName,
        autorFoto: user.fotoPerfil || "",
        tipo: imagePreview ? "imagem" : "texto",
        texto: text.trim(),
        link: normalizedLink,
        imagem: imagePreview,
        imagemNome: imageFile?.name || "",
        imagemTipo: imageFile?.type || "",
        publicoAlvo: audience,
      });

      setConfirmOpen(false);
      resetComposer();
      onPublished?.(audience);
      setSuccessOpen(true);
    } catch (error) {
      console.error("Erro ao enviar contribuição para o blog:", error);
      setConfirmOpen(false);
      setFormError(getSubmissionErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="composer">
      <div className="composer-header">
        <div className="composer-avatar">
          {user?.fotoPerfil ? (
            <img src={user.fotoPerfil} alt={`Foto de perfil de ${profileName}`} />
          ) : (
            <span>{profileInitials}</span>
          )}
        </div>

        <textarea
          ref={textInputRef}
          rows="3"
          maxLength="1500"
          placeholder="Conte uma dica, experiência ou aprendizado sobre reciclagem..."
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
      </div>

      <fieldset className="composer-audience">
        <legend>Este conteúdo é indicado para:</legend>
        <div className="composer-audience-options">
          <button
            type="button"
            className={audience === ALL_AUDIENCES_ID ? "is-selected" : ""}
            aria-pressed={audience === ALL_AUDIENCES_ID}
            onClick={() => setAudience(ALL_AUDIENCES_ID)}
          >
            Todos
          </button>
          {perfis.map((perfil) => (
            <button
              key={perfil.id}
              type="button"
              className={audience === perfil.id ? "is-selected" : ""}
              aria-pressed={audience === perfil.id}
              onClick={() => setAudience(perfil.id)}
            >
              {perfil.label}
            </button>
          ))}
        </div>
      </fieldset>

      {imagePreview && (
        <div className="composer-image-preview">
          <img src={imagePreview} alt="Prévia da imagem selecionada" />
          <div>
            <strong>Imagem selecionada</strong>
            <span>{imageFile?.name}</span>
          </div>
          <IconButton label="Remover imagem" onClick={removeImage}>
            <FaTimes />
          </IconButton>
        </div>
      )}

      {showLinkInput && (
        <div className="composer-link-field">
          <FaLink aria-hidden="true" />
          <input
            type="url"
            inputMode="url"
            placeholder="Cole o endereço do conteúdo"
            value={link}
            onChange={(event) => setLink(event.target.value)}
          />
          <IconButton
            label="Remover link"
            onClick={() => {
              setLink("");
              setShowLinkInput(false);
            }}
          >
            <FaTimes />
          </IconButton>
        </div>
      )}

      {showEmojiPicker && (
        <div className="composer-emoji-picker" aria-label="Escolha um emoji">
          {BLOG_EMOJIS.map((emoji) => (
            <IconButton
              key={emoji}
              label={`Adicionar emoji ${emoji}`}
              onClick={() => insertEmoji(emoji)}
            >
              {emoji}
            </IconButton>
          ))}
        </div>
      )}

      <FormMessage className="composer-error">{formError}</FormMessage>

      <div className="composer-footer">
        <div className="composer-tools">
          <input
            type="file"
            hidden
            ref={imageInputRef}
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={(event) => handleImage(event.target.files[0])}
          />
          <IconButton
            className={imageFile ? "active" : ""}
            onClick={() => imageInputRef.current?.click()}
            label="Adicionar imagem"
            pressed={Boolean(imageFile)}
            title="Adicionar imagem de até 600 KB"
          >
            <FaImage />
          </IconButton>
          <IconButton
            className={showLinkInput ? "active" : ""}
            onClick={() => setShowLinkInput((visible) => !visible)}
            label="Adicionar link"
            pressed={showLinkInput}
            title="Adicionar link"
          >
            <FaLink />
          </IconButton>
          <IconButton
            className={showEmojiPicker ? "active" : ""}
            onClick={() => setShowEmojiPicker((visible) => !visible)}
            label="Adicionar emoji"
            pressed={showEmojiPicker}
            title="Adicionar emoji"
          >
            <FaSmile />
          </IconButton>
        </div>

        <Button
          variant="gradient"
          className="composer-submit"
          disabled={!canSubmit || submitting}
          onClick={requestConfirmation}
        >
          Enviar para aprovação
        </Button>
      </div>

      <Alert
        isOpen={confirmOpen}
        title="Enviar contribuição para o Blog do Reci?"
        message="Revise o conteúdo antes de enviá-lo para aprovação."
        confirmText="Enviar contribuição"
        cancelText="Continuar editando"
        confirmIcon={<FaPaperPlane />}
        loading={submitting}
        onConfirm={submitContribution}
        onCancel={() => setConfirmOpen(false)}
        className="composer-confirm-alert"
      >
        <div className="composer-confirm-summary">
          <div className="composer-confirm-author">
            <div className="composer-avatar">
              {user?.fotoPerfil ? (
                <img src={user.fotoPerfil} alt="" />
              ) : (
                <span>{profileInitials}</span>
              )}
            </div>
            <div>
              <span>Enviado por</span>
              <strong>{profileName}</strong>
            </div>
          </div>
          {text.trim() && <p>{text.trim()}</p>}
          <div className="composer-confirm-items">
            <span>Para: {getAudienceLabel(audience)}</span>
            {imageFile && <span>1 imagem</span>}
            {normalizedLink && <span>1 link</span>}
          </div>
          {submitting && (
            <div className="composer-upload-progress">
              <span className="is-saving" />
              <small>Salvando contribuição...</small>
            </div>
          )}
        </div>
      </Alert>

      <Alert
        isOpen={successOpen}
        title="Contribuição enviada!"
        message="Seu conteúdo está pendente e aparecerá em Experiências reais após a aprovação."
        variant="success"
        confirmText="Entendi"
        showCancel={false}
        onConfirm={() => setSuccessOpen(false)}
        onCancel={() => setSuccessOpen(false)}
      />
    </div>
  );
}

export default function ComoFunciona() {
  const { user } = useAuth();
  const [blogContributions, setBlogContributions] = useState([]);
  const [blogLoading, setBlogLoading] = useState(true);
  const [blogError, setBlogError] = useState("");
  const [featuredArticleOpen, setFeaturedArticleOpen] = useState(false);
  const [selectedContribution, setSelectedContribution] = useState(null);
  const [selectedExtra, setSelectedExtra] = useState(null);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [selectedLessonIndex, setSelectedLessonIndex] = useState(0);
  const [guideProgress, setGuideProgress] = useState({});
  const [guideSaving, setGuideSaving] = useState(false);
  const [guideError, setGuideError] = useState("");
  const [selectedProfileId, setSelectedProfileId] = useState(() =>
    getDefaultAudience(user) === ALL_AUDIENCES_ID
      ? perfis[0].id
      : getDefaultAudience(user)
  );

  useEffect(() => {
    const unsubscribe = subscribeToBlogContributions(
      (contributions) => {
        setBlogContributions(contributions);
        setBlogError("");
        setBlogLoading(false);
      },
      (error) => {
        console.error("Erro ao carregar publicações do blog:", error);
        setBlogError("Não foi possível carregar as experiências agora.");
        setBlogLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  useEffect(() => {
    let active = true;

    if (!user?.uid) {
      setGuideProgress({});
      return () => {
        active = false;
      };
    }

    Promise.all(
      guias.map(async (guide) => [guide.id, await getGuideProgress(user.uid, guide.id)])
    )
      .then((entries) => {
        if (active) setGuideProgress(Object.fromEntries(entries));
      })
      .catch((error) => {
        console.error("Erro ao carregar o progresso das trilhas:", error);
        if (active) {
          setGuideError("Não foi possível carregar seu progresso agora.");
        }
      });

    return () => {
      active = false;
    };
  }, [user?.uid]);

  function openGuide(guide) {
    const completedLessons = guideProgress[guide.id] || [];
    const nextLessonIndex = guide.aulas.findIndex(
      (lesson) => !completedLessons.includes(lesson.id)
    );

    setSelectedGuide(guide);
    setSelectedLessonIndex(nextLessonIndex >= 0 ? nextLessonIndex : 0);
    setGuideError("");
  }

  async function toggleCurrentLesson() {
    if (!selectedGuide) return;

    const lesson = selectedGuide.aulas[selectedLessonIndex];
    const previousProgress = guideProgress[selectedGuide.id] || [];
    const isCompleted = previousProgress.includes(lesson.id);
    const nextProgress = isCompleted
      ? previousProgress.filter((lessonId) => lessonId !== lesson.id)
      : [...previousProgress, lesson.id];

    setGuideProgress((current) => ({
      ...current,
      [selectedGuide.id]: nextProgress,
    }));
    setGuideError("");

    if (!user?.uid) return;

    setGuideSaving(true);
    try {
      await saveGuideProgress(user.uid, selectedGuide.id, nextProgress);
    } catch (error) {
      console.error("Erro ao salvar o progresso da trilha:", error);
      setGuideProgress((current) => ({
        ...current,
        [selectedGuide.id]: previousProgress,
      }));
      setGuideError("Não foi possível salvar esta aula. Tente novamente.");
    } finally {
      setGuideSaving(false);
    }
  }

  const selectedProfile =
    perfis.find((perfil) => perfil.id === selectedProfileId) || perfis[0];
  const filteredBlogContributions = blogContributions.filter(
    (contribution) =>
      !contribution.publicoAlvo ||
      contribution.publicoAlvo === ALL_AUDIENCES_ID ||
      contribution.publicoAlvo === selectedProfileId
  );
  const selectedGuideProgress = selectedGuide
    ? guideProgress[selectedGuide.id] || []
    : [];
  const selectedLesson = selectedGuide?.aulas[selectedLessonIndex] || null;
  const selectedGuidePercent = selectedGuide
    ? Math.round(
        (selectedGuideProgress.length / selectedGuide.aulas.length) * 100
      )
    : 0;
  const selectedGuideCompleted = Boolean(
    selectedGuide &&
      selectedGuideProgress.length === selectedGuide.aulas.length
  );

  return (
    <>
      <PageLayout>

      <main className="como-funciona">
        <section id="comunidade" className="comunidade">
          <section className="comunidade-learning-section comunidade-learning-main-section">
            <div className="comunidade-main-intro">
              <SectionHeader
                className="comunidade-section-header"
                titleAs="h1"
                eyebrow="Como reciclar"
                icon={<FaRecycle />}
                title="Aprenda, prepare seus materiais e recicle com mais segurança"
                text="Nesta página, você encontra dicas, relatos, vídeos, guias e respostas práticas para usar melhor o Recicla que Pontua no dia a dia."
              />
              <img
                className="section-title-image pet-floating"
                src={PetDicas}
                alt="Mascote do Recicla que Pontua dando boas-vindas"
              />
            </div>

            <div className="comunidade-learning-layout">
              <aside className="comunidade-sidebar">
                <span className="comunidade-sidebar-label">Experiências reais</span>
                <p>Histórias enviadas por participantes do Recicla que Pontua.</p>
                <p className="comunidade-sidebar-filter">
                  Conteúdo para <strong>{selectedProfile.label}</strong>
                </p>

                <div className="comunidade-article-list">
                  {blogLoading && (
                    <p className="comunidade-blog-state">Carregando experiências...</p>
                  )}
                  {!blogLoading && blogError && (
                    <p className="comunidade-blog-state is-error">{blogError}</p>
                  )}
                  {!blogLoading && !blogError && filteredBlogContributions.length === 0 && (
                    <p className="comunidade-blog-state">
                      Ainda não há experiências para este perfil. Compartilhe a
                      primeira no Blog do Reci!
                    </p>
                  )}
                  {filteredBlogContributions.map((contribution) => (
                    <CommunityArticleCard
                      key={contribution.id}
                      contribution={contribution}
                      onOpen={setSelectedContribution}
                    />
                  ))}
                </div>
              </aside>

              <div className="comunidade-learning-main">
                <article className="comunidade-featured-card">
                  <div className="comunidade-featured-visual">
                    <FaLeaf />
                  </div>
                  <div>
                    <span>Conteúdo em destaque</span>
                    <h3>{featuredArticle.title}</h3>
                    <p>{featuredArticle.text}</p>
                    <Button
                      variant="green"
                      type="button"
                      onClick={() => setFeaturedArticleOpen(true)}
                    >
                      Ler conteúdo completo <FaArrowRight />
                    </Button>
                  </div>
                </article>

                <div className="comunidade-profile-grid">
                  {perfis.map((perfil) => (
                    <button
                      key={perfil.id}
                      type="button"
                      className={`comunidade-profile-card${
                        perfil.id === selectedProfileId ? " is-active" : ""
                      }`}
                      aria-pressed={perfil.id === selectedProfileId}
                      onClick={() => setSelectedProfileId(perfil.id)}
                    >
                      <span>{perfil.icone}</span>
                      <h3>{perfil.label}</h3>
                      <p>{perfil.resumo}</p>
                    </button>
                  ))}
                </div>

                <section
                  key={selectedProfile.id}
                  className="comunidade-profile-details"
                  aria-live="polite"
                >
                  <div className="comunidade-profile-details-head">
                    <span>{selectedProfile.icone}</span>
                    <div>
                      <small>Orientações para {selectedProfile.label}</small>
                      <h3>{selectedProfile.resumo}</h3>
                      <p>{selectedProfile.introducao}</p>
                    </div>
                  </div>
                  <div className="comunidade-profile-tips">
                    {selectedProfile.topicos.map((topico) => (
                      <article key={topico.titulo}>
                        <FaRegCircleCheck />
                        <div>
                          <h4>{topico.titulo}</h4>
                          <p>{topico.texto}</p>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              </div>
            </div>

            <div className="comunidade-original-content-grid">
              <section>
                <div className="comunidade-mini-head">
                  <h3>Aulas</h3>
                  <span>Conteúdos para aprender</span>
                </div>
                <div className="comunidade-guide-grid">
                  {guias.map((guide) => (
                    <GuideCard
                      key={guide.id}
                      guide={guide}
                      completedLessons={guideProgress[guide.id] || []}
                      user={user}
                      onOpen={openGuide}
                    />
                  ))}
                </div>
              </section>

              <section className="comunidade-extras-section">
                <div className="comunidade-mini-head">
                  <h3>Recursos extras</h3>
                  <span>Apoio rápido</span>
                </div>
                <div className="comunidade-extra-grid">
                  {extras.map((extra) => (
                    <button
                      key={extra.id}
                      type="button"
                      className="comunidade-extra-card"
                      onClick={() => setSelectedExtra(extra)}
                    >
                      <span>{extra.icone}</span>
                      <h3>{extra.titulo}</h3>
                      <p>{extra.texto}</p>
                      <small>
                        Abrir recurso <FaArrowRight />
                      </small>
                    </button>
                  ))}
                </div>
              </section>
            </div>
          </section>

          {user && (
            <section className="comunidade-composer-section">
              <div className="comunidade-composer-layout">
                <div className="comunidade-composer-visual">
                  <img
                    className="section-title-image pet-floating"
                    src={PetBlog}
                    alt="Mascote do Recicla que Pontua convidando a comunidade a compartilhar uma dica"
                  />
                </div>

                <SectionHeader
                  className="comunidade-section-header comunidade-composer-header"
                  eyebrow="Blog do Reci"
                  icon={<FaPen />}
                  title="Sua experiência pode inspirar outras pessoas"
                  text="Compartilhe dicas, relatos ou imagens sobre reciclagem. Após a aprovação, sua publicação aparecerá em Experiências reais e poderá ajudar mais pessoas a reciclar melhor."
                />

                <PostComposer
                  user={user}
                  onPublished={(audienceId) => {
                    if (audienceId !== ALL_AUDIENCES_ID) {
                      setSelectedProfileId(audienceId);
                    }
                  }}
                />
              </div>
            </section>
          )}

          <section className="comunidade-prep-section">
            <div className="comunidade-prep-intro">
              <SectionHeader
                className="comunidade-section-header"
                eyebrow="Antes de entregar"
                icon={<FaRegCircleCheck />}
                title="Pequenos cuidados que aumentam o valor do material"
                text="A separação correta reduz rejeitos, evita mau cheiro e ajuda centros e coletores a trabalharem com mais agilidade."
              />
              <img
                className="section-title-image pet-floating"
                src={PetMateriais}
                alt="Mascote separando materiais recicláveis"
              />
            </div>

            <div className="comunidade-prep-grid">
              <article className="comunidade-checklist-card">
                <h3>Checklist rápido</h3>
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

          <Alert
            isOpen={featuredArticleOpen}
            title={featuredArticle.title}
            message={featuredArticle.text}
            variant="info"
            confirmText="Fechar conteúdo"
            showCancel={false}
            onConfirm={() => setFeaturedArticleOpen(false)}
            onCancel={() => setFeaturedArticleOpen(false)}
            className="comunidade-featured-alert"
          >
            <article className="comunidade-featured-reader">
              <div className="comunidade-featured-meta">
                <span>Conteúdo em destaque</span>
                <small>{featuredArticle.readingTime}</small>
              </div>

              <p className="comunidade-featured-introduction">
                {featuredArticle.introduction}
              </p>

              <div className="comunidade-featured-sections">
                {featuredArticle.sections.map((section) => (
                  <section key={section.title}>
                    <h3>{section.title}</h3>
                    <p>{section.text}</p>
                  </section>
                ))}
              </div>

              <aside className="comunidade-featured-closing">
                <FaRecycle aria-hidden="true" />
                <div>
                  <strong>O seu cuidado faz diferença</strong>
                  <p>{featuredArticle.closing}</p>
                </div>
              </aside>
            </article>
          </Alert>

          <Alert
            isOpen={Boolean(selectedContribution)}
            title="Relato da comunidade"
            variant="info"
            confirmText="Fechar"
            showCancel={false}
            onConfirm={() => setSelectedContribution(null)}
            onCancel={() => setSelectedContribution(null)}
            className="comunidade-experience-alert"
          >
            {selectedContribution && (
              <div className="comunidade-experience-reader">
                <div className="comunidade-experience-author-photo">
                  {selectedContribution.autorFoto ? (
                    <img
                      src={selectedContribution.autorFoto}
                      alt={`Foto de ${
                        selectedContribution.autorNome || "Participante"
                      }`}
                    />
                  ) : (
                    <span>
                      {(selectedContribution.autorNome || "Participante")
                        .split(/\s+/)
                        .slice(0, 2)
                        .map((part) => part[0])
                        .join("")
                        .toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="comunidade-experience-copy">
                  <span>
                    Para {getAudienceLabel(selectedContribution.publicoAlvo)}
                  </span>
                  <h3>{selectedContribution.autorNome || "Participante"}</h3>
                  {selectedContribution.texto && <p>{selectedContribution.texto}</p>}
                  {selectedContribution.imagem && (
                    <img
                      src={selectedContribution.imagem}
                      alt={`Imagem compartilhada por ${
                        selectedContribution.autorNome || "Participante"
                      }`}
                    />
                  )}
                </div>

              </div>
            )}
          </Alert>

          <Alert
            isOpen={Boolean(selectedExtra)}
            title={selectedExtra?.titulo || "Recurso"}
            message={selectedExtra?.descricao || ""}
            variant="info"
            confirmText="Fechar"
            showCancel={false}
            onConfirm={() => setSelectedExtra(null)}
            onCancel={() => setSelectedExtra(null)}
            className="comunidade-extra-alert"
          >
            {selectedExtra && (
              <div className="comunidade-extra-reader">
                {selectedExtra.topicos.map((topico) => (
                  <article key={topico.titulo}>
                    <FaRegCircleCheck />
                    <div>
                      <h3>{topico.titulo}</h3>
                      <p>{topico.texto}</p>
                    </div>
                  </article>
                ))}
                <div className="comunidade-extra-actions">
                  <Button
                    variant="green"
                    className="comunidade-extra-close"
                    onClick={() => setSelectedExtra(null)}
                  >
                    Fechar
                  </Button>
                  {selectedExtra.cta && (
                    <Button
                      variant="gradient"
                      to={selectedExtra.cta.to}
                      onClick={() => setSelectedExtra(null)}
                    >
                      {selectedExtra.cta.label} <FaArrowRight />
                    </Button>
                  )}
                </div>
              </div>
            )}
          </Alert>

          <Alert
            isOpen={Boolean(selectedGuide)}
            title={selectedGuide?.titulo || "Aula"}
            message={selectedGuide?.resumo || ""}
            variant="info"
            confirmText="Fechar aula"
            showCancel={false}
            onConfirm={() => {
              setSelectedGuide(null);
              setGuideError("");
            }}
            onCancel={() => {
              setSelectedGuide(null);
              setGuideError("");
            }}
            className="comunidade-guide-alert"
          >
            {selectedGuide && selectedLesson && (
              <div className="comunidade-course-reader">
                <div className="comunidade-course-progress-head">
                  <span>
                    {selectedGuideProgress.length} de {selectedGuide.aulas.length}{" "}
                    etapas concluídas
                  </span>
                  <strong>{selectedGuidePercent}%</strong>
                </div>
                <div
                  className="comunidade-course-progress"
                  role="progressbar"
                  aria-label={`Progresso na aula ${selectedGuide.titulo}`}
                  aria-valuemin="0"
                  aria-valuemax="100"
                  aria-valuenow={selectedGuidePercent}
                >
                  <span style={{ width: `${selectedGuidePercent}%` }} />
                </div>

                {!user && (
                  <p className="comunidade-course-login-note">
                    Você pode estudar sem entrar. Para manter o progresso salvo em
                    outros acessos, entre na sua conta.
                  </p>
                )}
                <FormMessage className="comunidade-course-error">
                  {guideError}
                </FormMessage>

                <div className="comunidade-course-layout">
                  <nav
                    className="comunidade-course-lessons"
                    aria-label="Etapas da aula"
                  >
                    {selectedGuide.aulas.map((lesson, index) => {
                      const isCompleted = selectedGuideProgress.includes(
                        lesson.id
                      );

                      return (
                        <button
                          key={lesson.id}
                          type="button"
                          className={`${
                            index === selectedLessonIndex ? "is-active" : ""
                          }${isCompleted ? " is-completed" : ""}`}
                          aria-current={
                            index === selectedLessonIndex ? "step" : undefined
                          }
                          onClick={() => setSelectedLessonIndex(index)}
                        >
                          <span>
                            {isCompleted ? <FaRegCircleCheck /> : index + 1}
                          </span>
                          <div>
                            <strong>{lesson.titulo}</strong>
                            <small>{lesson.resumo}</small>
                          </div>
                        </button>
                      );
                    })}
                  </nav>

                  <article className="comunidade-course-content">
                    <span>
                      Etapa {selectedLessonIndex + 1} de {selectedGuide.aulas.length}
                    </span>
                    <h3>{selectedLesson.titulo}</h3>
                    <p className="comunidade-course-summary">
                      {selectedLesson.resumo}
                    </p>
                    <div className="comunidade-course-text">
                      {selectedLesson.conteudo.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>

                    <div className="comunidade-course-controls">
                      <Button
                        variant="green"
                        className="comunidade-course-secondary"
                        disabled={selectedLessonIndex === 0}
                        onClick={() =>
                          setSelectedLessonIndex((current) =>
                            Math.max(0, current - 1)
                          )
                        }
                      >
                        Anterior
                      </Button>
                      <Button
                        variant={
                          selectedGuideProgress.includes(selectedLesson.id)
                            ? "green"
                            : "gradient"
                        }
                        loading={guideSaving}
                        loadingText="Salvando..."
                        onClick={toggleCurrentLesson}
                      >
                        <FaRegCircleCheck />
                        {selectedGuideProgress.includes(selectedLesson.id)
                          ? "Etapa concluída"
                          : "Concluir etapa"}
                      </Button>
                      <Button
                        variant="green"
                        className="comunidade-course-secondary"
                        disabled={
                          selectedLessonIndex === selectedGuide.aulas.length - 1
                        }
                        onClick={() =>
                          setSelectedLessonIndex((current) =>
                            Math.min(selectedGuide.aulas.length - 1, current + 1)
                          )
                        }
                      >
                        Próxima <FaArrowRight />
                      </Button>
                    </div>
                  </article>
                </div>

                {selectedGuideCompleted && (
                  <div className="comunidade-course-complete">
                    <FaRegCircleCheck />
                    <div>
                      <strong>Aula concluída!</strong>
                      <p>
                        Você terminou todas as aulas e já pode colocar esse
                        aprendizado em prática.
                      </p>
                    </div>
                    {selectedGuide.cta && (
                      <Button
                        variant="gradient"
                        to={user ? selectedGuide.cta.to : "/login"}
                        onClick={() => setSelectedGuide(null)}
                      >
                        {selectedGuide.cta.label} <FaArrowRight />
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )}
          </Alert>

          <section id="videos-reciclagem" className="comunidade-videos-section">
            <SectionHeader
              className="comunidade-section-header"
              eyebrow="Vídeos"
              icon={<FaVideo />}
              title="Aprenda vendo exemplos reais"
              text="Conteúdos curtos para entender o que pode ser reciclado, como limpar embalagens e como evitar os erros mais comuns."
            />

            <div className="comunidade-video-grid">
              {videos.map((video) => (
                <VideoCard key={video.title} {...video} />
              ))}
            </div>
          </section>

          <section className="comunidade-impact-section">
            <SectionHeader
              className="comunidade-impact-text"
              eyebrow="Por que isso importa?"
              icon={<FaRecycle />}
              title="Reciclar melhor melhora o resultado de todo mundo"
              text="Quando o material chega limpo, separado e com informações claras, a plataforma consegue conectar melhor pessoas recicladoras, coletores e centros de reciclagem."
            />

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

          <section className="comunidade-final-cta">
            <SectionHeader
              className="comunidade-final-copy"
              title="Agora é só preparar os materiais e escolher o destino."
              text="Use o que aprendeu aqui para deixar tudo limpo, separado e pronto para pontuar no Recicla que Pontua."
            />
            <div className="comunidade-final-visual">
              <img
                className="section-title-image pet-floating"
                src={LogoRetrato}
                alt="Mascote incentivando a preparar entrega"
              />
              <Button
                variant="gradient"
                to={user ? "/doacao/cadastrar-materiais" : "/login"}
              >
                Preparar entrega <FaArrowRight />
              </Button>
            </div>
          </section>
        </section>
      </main>

      </PageLayout>
    </>
  );
}
