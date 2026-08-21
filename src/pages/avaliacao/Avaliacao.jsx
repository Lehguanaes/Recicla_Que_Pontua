import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import {
  FaCheck,
  FaComments,
  FaMapMarkerAlt,
  FaRecycle,
  FaRegStar,
  FaStar,
  FaUserCircle,
} from "react-icons/fa";

import PageLayout from "../../components/layout/PageLayout";
import Alert from "../../components/alert/Alert";
import Button from "../../components/button/Button";
import FormMessage from "../../components/form/FormMessage";
import { PageHeader } from "../../components/typography/Typography";
import { useAuth } from "../../contexts/AuthContext";
import { submitExchangeEvaluation } from "../../services/evaluationService";
import { db } from "../../services/Firebase";
import { PROFILE_IDS } from "../../constants/profiles";
import PetAvaliacao from "../../assets/PetAvaliacao.png";

import "./avaliacao.css";

const MAX_COMMENT_LENGTH = 500;

const REVIEW_HIGHLIGHTS = [
  "Boa comunicação",
  "Pontualidade",
  "Organização",
  "Cuidado com os materiais",
  "Atendimento atencioso",
  "Cumpriu o combinado",
  "Agilidade",
  "Responsabilidade",
  "Confiança",
  "Respeito",
];

const RATING_LABELS = {
  1: "Muito ruim",
  2: "Ruim",
  3: "Regular",
  4: "Boa",
  5: "Excelente",
};

export default function Avaliacao() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const parceiro = location.state?.parceiro || {};
  const conviteId = location.state?.conviteId || "";
  const chatId = location.state?.chatId || "";
  const solicitacaoId =
    location.state?.solicitacaoId || conviteId || "original";

  const [nota, setNota] = useState(0);
  const [notaEmFoco, setNotaEmFoco] = useState(0);
  const [destaques, setDestaques] = useState([]);
  const [comentario, setComentario] = useState("");
  const [adicionarFavorito, setAdicionarFavorito] = useState(false);
  const [permitirAcessoDireto, setPermitirAcessoDireto] = useState(() =>
    Boolean(user?.acessosDiretosChat?.includes(parceiro.id))
  );
  const [acessoDiretoInicial, setAcessoDiretoInicial] = useState(false);
  const [permissaoDiretaCarregada, setPermissaoDiretaCarregada] = useState(false);
  const [erro, setErro] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [pontosConcedidos, setPontosConcedidos] = useState(0);
  const [acessoDiretoConcedido, setAcessoDiretoConcedido] = useState(false);

  const parceiroDisponivel = Boolean(parceiro.id && chatId);
  const podeAdicionarFavorito = [
    PROFILE_IDS.PERSON,
    PROFILE_IDS.INSTITUTION,
  ].includes(user?.perfil);
  const podePermitirAcessoDireto =
    [PROFILE_IDS.COLLECTOR, PROFILE_IDS.CENTER].includes(user?.perfil) &&
    [PROFILE_IDS.PERSON, PROFILE_IDS.INSTITUTION].includes(parceiro.perfilId);

  useEffect(() => {
    let active = true;

    if (!podePermitirAcessoDireto || !user?.uid || !parceiro.id) {
      setPermissaoDiretaCarregada(true);
      return () => {
        active = false;
      };
    }

    setPermissaoDiretaCarregada(false);
    getDoc(doc(db, "usuarios", user.uid))
      .then((snapshot) => {
        if (!active) return;
        const savedAccess = snapshot.exists()
          ? snapshot.data().acessosDiretosChat
          : [];
        const allowedProfiles = Array.isArray(savedAccess) ? savedAccess : [];
        const hasDirectAccess = allowedProfiles.includes(parceiro.id);
        setPermitirAcessoDireto(hasDirectAccess);
        setAcessoDiretoInicial(hasDirectAccess);
      })
      .catch((error) => {
        console.error("Erro ao carregar permissão de acesso direto:", error);
      })
      .finally(() => {
        if (active) setPermissaoDiretaCarregada(true);
      });

    return () => {
      active = false;
    };
  }, [podePermitirAcessoDireto, user?.uid, parceiro.id]);

  function alternarDestaque(item) {
    setDestaques((atuais) =>
      atuais.includes(item)
        ? atuais.filter((destaque) => destaque !== item)
        : [...atuais, item]
    );
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!parceiroDisponivel) {
      setErro("Abra esta avaliação pelo chat de uma troca finalizada.");
      return;
    }

    if (podePermitirAcessoDireto && !permissaoDiretaCarregada) {
      setErro("Aguarde enquanto verificamos a permissão de acesso direto.");
      return;
    }

    if (!nota) {
      setErro("Escolha uma nota de 1 a 5 estrelas.");
      return;
    }

    if (!destaques.length) {
      setErro("Selecione ao menos um destaque da experiência.");
      return;
    }

    setErro("");
    setConfirmOpen(true);
  }

  async function handleConfirm() {
    if (!user?.uid) {
      setConfirmOpen(false);
      navigate("/login");
      return;
    }

    setSalvando(true);

    try {
      const result = await submitExchangeEvaluation({
        chatId,
        exchangeId: solicitacaoId,
        invitationId: conviteId,
        evaluator: { id: user.uid, name: user.nome || "" },
        evaluated: { id: parceiro.id, name: parceiro.nome || "" },
        rating: nota,
        highlights: destaques,
        comment: comentario,
        addFavorite: podeAdicionarFavorito && adicionarFavorito,
        allowDirectChat: podePermitirAcessoDireto && permitirAcessoDireto,
      });

      setPontosConcedidos(result.bonusPoints);
      setAcessoDiretoConcedido(result.directAccessGranted);
      setConfirmOpen(false);
      setSuccessOpen(true);
    } catch (error) {
      console.error("Erro ao enviar avaliação:", error);
      setConfirmOpen(false);
      if (error.code === "evaluation/already-submitted") {
        setErro("Você já avaliou esta troca.");
      } else if (error.code === "evaluation/exchange-not-finished") {
        setErro("Finalize a troca no chat antes de enviar a avaliação.");
      } else {
        setErro("Não foi possível enviar sua avaliação. Tente novamente.");
      }
    } finally {
      setSalvando(false);
    }
  }

  const notaVisual = notaEmFoco || nota;

  return (
    <>
      <PageLayout>

      <main className="evaluation-page">
        <div className="evaluation-hero">
          <PageHeader
            className="evaluation-header"
            eyebrowClassName="evaluation-kicker"
            eyebrow="Avaliação da troca"
            icon={<FaStar />}
            title="Como foi sua experiência?"
            text="Sua avaliação ajuda a fortalecer a confiança da comunidade e torna as próximas trocas mais seguras para todos."
          />

          <div className="evaluation-hero-visual" aria-hidden="true">
            <img
              className="section-title-image pet-floating"
              src={PetAvaliacao}
              alt=""
            />
          </div>
        </div>

        <div className="evaluation-layout">
          <form className="evaluation-form-card" onSubmit={handleSubmit}>
            <section className="evaluation-partner-card">
              <div className="evaluation-avatar pet-floating">
                {parceiro.fotoPerfil ? (
                  <img src={parceiro.fotoPerfil} alt={parceiro.nome} />
                ) : (
                  <FaUserCircle />
                )}
              </div>

              <div className="evaluation-partner-info">
                <h2>{parceiro.nome || "Parceiro da reciclagem"}</h2>
                <span className="evaluation-profile-tag">
                  {parceiro.perfil || "Perfil da comunidade"}
                </span>

                {(parceiro.cidade || parceiro.estado) && (
                  <p className="evaluation-location">
                    <FaMapMarkerAlt />
                    {[parceiro.cidade, parceiro.estado]
                      .filter(Boolean)
                      .join(" - ")}
                  </p>
                )}
              </div>

              <div className="evaluation-partner-note">
                <span aria-hidden="true">
                  <FaRecycle />
                </span>
                <div>
                  <strong>Sobre esta avaliação</strong>
                  <p>Considere somente a experiência desta troca.</p>
                </div>
              </div>
            </section>

            <div className="evaluation-required-grid">
            <section
              className="evaluation-fieldset evaluation-required-card"
              aria-labelledby="rating-title"
            >
              <div className="evaluation-question">
                <span>1</span>
                <div>
                  <h2 id="rating-title">
                    Qual nota você daria para a troca?
                    <span className="evaluation-required-mark" aria-label="obrigatório">
                      *
                    </span>
                  </h2>
                  <p>Escolha de uma a cinco estrelas.</p>
                </div>
              </div>

              <div
                className="evaluation-stars"
                onMouseLeave={() => setNotaEmFoco(0)}
                aria-label="Nota da experiência"
                aria-required="true"
              >
                {[1, 2, 3, 4, 5].map((valor) => {
                  const StarIcon = valor <= notaVisual ? FaStar : FaRegStar;

                  return (
                    <button
                      key={valor}
                      type="button"
                      className={valor <= notaVisual ? "selected" : ""}
                      aria-label={`${valor} ${valor === 1 ? "estrela" : "estrelas"}`}
                      aria-pressed={nota === valor}
                      onMouseEnter={() => setNotaEmFoco(valor)}
                      onFocus={() => setNotaEmFoco(valor)}
                      onBlur={() => setNotaEmFoco(0)}
                      onClick={() => {
                        setNota(valor);
                        setErro("");
                      }}
                    >
                      <StarIcon />
                    </button>
                  );
                })}
              </div>

              <p className="evaluation-rating-label" aria-live="polite">
                {notaVisual
                  ? `${notaVisual} de 5 — ${RATING_LABELS[notaVisual]} · +${notaVisual * 10} pontos para o perfil avaliado`
                  : "Nenhuma nota selecionada"}
              </p>
            </section>

            <section
              className="evaluation-fieldset evaluation-required-card"
              aria-labelledby="highlights-title"
            >
              <div className="evaluation-question">
                <span>2</span>
                <div>
                  <h2 id="highlights-title">
                    O que mais se destacou?
                    <span className="evaluation-required-mark" aria-label="obrigatório">
                      *
                    </span>
                  </h2>
                  <p>Selecione ao menos uma opção.</p>
                </div>
              </div>

              <div className="evaluation-highlights" aria-required="true">
                {REVIEW_HIGHLIGHTS.map((item) => {
                  const selecionado = destaques.includes(item);

                  return (
                    <button
                      key={item}
                      type="button"
                      className={selecionado ? "selected" : ""}
                      aria-pressed={selecionado}
                      onClick={() => alternarDestaque(item)}
                    >
                      {selecionado && <FaCheck />}
                      {item}
                    </button>
                  );
                })}
              </div>
            </section>
            </div>

            <section className="evaluation-fieldset" aria-labelledby="comment-title">
              <div className="evaluation-question">
                <span>3</span>
                <div>
                  <h2 id="comment-title">Quer contar mais alguma coisa?</h2>
                  <p>O comentário é opcional, mas pode ajudar outros usuários.</p>
                </div>
              </div>

              <textarea
                value={comentario}
                maxLength={MAX_COMMENT_LENGTH}
                placeholder="Conte como foi a comunicação, o atendimento e a entrega dos materiais..."
                onChange={(event) => setComentario(event.target.value)}
              />
              <span className="evaluation-character-count">
                {comentario.length}/{MAX_COMMENT_LENGTH}
              </span>
            </section>

            {podeAdicionarFavorito && (
              <section className="evaluation-favorite-card">
                <label>
                  <input
                    type="checkbox"
                    checked={adicionarFavorito}
                    onChange={(event) => setAdicionarFavorito(event.target.checked)}
                  />
                  <span className="evaluation-favorite-icon" aria-hidden="true">
                    <FaStar />
                  </span>
                  <span className="evaluation-favorite-copy">
                    <strong>Adicionar este perfil aos favoritos?</strong>
                    <span>
                      Perfis favoritos aparecem primeiro na lista do mapa e recebem
                      uma estrela de destaque.
                    </span>
                  </span>
                  <span className="evaluation-favorite-switch" aria-hidden="true" />
                </label>
              </section>
            )}

            {podePermitirAcessoDireto && (
              <section className="evaluation-favorite-card evaluation-direct-access-card">
                <label>
                  <input
                    type="checkbox"
                    checked={permitirAcessoDireto}
                    onChange={(event) =>
                      setPermitirAcessoDireto(event.target.checked)
                    }
                    disabled={!permissaoDiretaCarregada}
                  />
                  <span className="evaluation-favorite-icon" aria-hidden="true">
                    <FaComments />
                  </span>
                  <span className="evaluation-favorite-copy">
                    <strong>Permitir novas trocas sem convite?</strong>
                    <span>
                      {permissaoDiretaCarregada
                        ? "Esta pessoa ou instituição poderá selecionar materiais e iniciar uma nova troca diretamente pelo chat."
                        : "Verificando a permissão atual..."}
                    </span>
                  </span>
                  <span className="evaluation-favorite-switch" aria-hidden="true" />
                </label>
              </section>
            )}

            <FormMessage className="evaluation-error">{erro}</FormMessage>

            <div className="evaluation-actions">
              <Button
                variant="neutral"
                type="button"
                className="evaluation-secondary-button"
                onClick={() => navigate("/chat")}
              >
                Voltar
              </Button>
              <Button
                variant="gradient"
                type="submit"
                className="evaluation-primary-button"
                disabled={podePermitirAcessoDireto && !permissaoDiretaCarregada}
              >
                Enviar avaliação
              </Button>
            </div>
          </form>
        </div>
      </main>

      </PageLayout>

      <Alert
        isOpen={confirmOpen}
        title="Enviar esta avaliação?"
        message="Confira o resumo antes de compartilhar sua experiência."
        variant="info"
        confirmText="Enviar avaliação"
        cancelText="Revisar"
        onConfirm={handleConfirm}
        onCancel={() => setConfirmOpen(false)}
        loading={salvando}
      >
        <div className="evaluation-confirm-summary">
          <div>
            <span>Perfil</span>
            <strong>{parceiro.nome || "Parceiro da reciclagem"}</strong>
          </div>
          <div>
            <span>Nota</span>
            <strong>{nota} de 5 estrelas</strong>
          </div>
          <div>
            <span>Destaques</span>
            <strong>
              {destaques.length ? destaques.join(", ") : "Nenhum selecionado"}
            </strong>
          </div>
          <div>
            <span>Bônus</span>
            <strong>+{nota * 10} pontos para {parceiro.nome || "o perfil avaliado"}</strong>
          </div>
          {podeAdicionarFavorito && (
            <div>
              <span>Favorito</span>
              <strong>{adicionarFavorito ? "Será adicionado" : "Não adicionar"}</strong>
            </div>
          )}
          {podePermitirAcessoDireto && (
            <div>
              <span>Acesso direto</span>
              <strong>
                {permitirAcessoDireto
                  ? "Poderá iniciar novas trocas sem convite"
                  : "Continuará exigindo convite"}
              </strong>
            </div>
          )}
        </div>
      </Alert>

      <Alert
        isOpen={successOpen}
        title="Avaliação enviada!"
        message={`Sua avaliação concedeu ${pontosConcedidos} pontos ao perfil avaliado${podeAdicionarFavorito && adicionarFavorito ? " e ele foi adicionado aos seus favoritos" : ""}${podePermitirAcessoDireto && acessoDiretoInicial !== acessoDiretoConcedido ? acessoDiretoConcedido ? ". O acesso direto para novas trocas também foi liberado" : ". O acesso direto foi desativado e novas trocas voltarão a exigir convite" : ""}.`}
        variant="success"
        confirmText="Entendi"
        showCancel={false}
        onConfirm={() => navigate("/chat", { replace: true })}
        onCancel={() => setSuccessOpen(false)}
      />
    </>
  );
}
