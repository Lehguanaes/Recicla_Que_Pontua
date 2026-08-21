import { useEffect, useMemo, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import {
  FaMapMarkerAlt,
  FaQuoteLeft,
  FaRecycle,
  FaRegStar,
  FaStar,
  FaUserCircle,
} from "react-icons/fa";

import Alert from "../alert/Alert";
import { MATERIAL_TYPES } from "../../constants";
import { getProfileLabel } from "../../constants/profiles";
import { db } from "../../services/Firebase";
import "./publicProfileModal.css";

function formatReviewDate(timestamp) {
  if (!timestamp) return "";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function RatingStars({ value }) {
  const rating = Math.round(Number(value) || 0);

  return (
    <span className="public-profile-stars" aria-label={`${rating} de 5 estrelas`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const StarIcon = star <= rating ? FaStar : FaRegStar;
        return <StarIcon key={star} aria-hidden="true" />;
      })}
    </span>
  );
}

export default function PublicProfileModal({ isOpen, profile, onClose }) {
  const [profileData, setProfileData] = useState(profile || null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;

    if (!isOpen || !profile?.id) return undefined;

    setProfileData(profile);
    setReviews([]);
    setLoadError("");
    setLoading(true);

    Promise.all([
      getDoc(doc(db, "usuarios", profile.id)),
      getDocs(
        query(
          collection(db, "avaliacoes"),
          where("avaliadoId", "==", profile.id)
        )
      ),
    ])
      .then(([profileSnapshot, reviewsSnapshot]) => {
        if (!active) return;

        const completeProfile = profileSnapshot.exists()
          ? { ...profile, ...profileSnapshot.data(), id: profile.id }
          : profile;
        const loadedReviews = reviewsSnapshot.docs
          .map((review) => ({ id: review.id, ...review.data() }))
          .sort(
            (first, second) =>
              (second.createdAt?.seconds || 0) -
              (first.createdAt?.seconds || 0)
          );

        setProfileData(completeProfile);
        setReviews(loadedReviews);
      })
      .catch((error) => {
        console.error("Erro ao carregar perfil público:", error);
        if (active) {
          setLoadError("Não foi possível carregar todas as avaliações agora.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [isOpen, profile]);

  const currentProfile = profileData || profile || {};
  const location = [
    currentProfile.endereco?.cidade || currentProfile.cidade,
    currentProfile.endereco?.estado || currentProfile.estado,
  ]
    .filter(Boolean)
    .join(" - ");
  const materialLabels = useMemo(() => {
    const materialMap = new Map(
      MATERIAL_TYPES.map((material) => [material.value, material.label])
    );
    return (currentProfile.materiaisAceitos || currentProfile.materiais || [])
      .map((material) =>
        materialMap.get(typeof material === "string" ? material : material.value)
      )
      .filter(Boolean);
  }, [currentProfile.materiais, currentProfile.materiaisAceitos]);
  const aggregateCount = Number(currentProfile.avaliacaoQuantidade) || 0;
  const aggregateAverage = aggregateCount
    ? Number(currentProfile.avaliacaoSoma || 0) / aggregateCount
    : Number(currentProfile.rating) || 0;
  const reviewAverage = reviews.length
    ? reviews.reduce((total, review) => total + Number(review.nota || 0), 0) /
      reviews.length
    : aggregateAverage;
  const reviewCount = reviews.length || aggregateCount;

  return (
    <Alert
      isOpen={isOpen}
      title="Perfil da comunidade"
      message="Conheça este perfil e veja como foram as experiências em trocas anteriores."
      variant="info"
      confirmText="Fechar"
      showCancel={false}
      onConfirm={onClose}
      onCancel={onClose}
      className="public-profile-modal"
    >
      <div className="public-profile-summary">
        <div className="public-profile-avatar">
          {currentProfile.fotoPerfil || currentProfile.foto ? (
            <img
              src={currentProfile.fotoPerfil || currentProfile.foto}
              alt={currentProfile.nome || "Perfil da comunidade"}
            />
          ) : (
            <FaUserCircle aria-hidden="true" />
          )}
        </div>

        <div className="public-profile-identity">
          <h3>{currentProfile.nome || "Perfil da comunidade"}</h3>
          <span>{getProfileLabel(currentProfile.perfil, currentProfile.subtipo)}</span>
          {location && (
            <p>
              <FaMapMarkerAlt aria-hidden="true" />
              {location}
            </p>
          )}
        </div>

        <div className="public-profile-rating">
          <strong>{reviewCount ? reviewAverage.toFixed(1) : "—"}</strong>
          <RatingStars value={reviewAverage} />
          <span>
            {reviewCount} {reviewCount === 1 ? "avaliação" : "avaliações"}
          </span>
        </div>
      </div>

      {materialLabels.length > 0 && (
        <div className="public-profile-materials">
          <strong>
            <FaRecycle aria-hidden="true" /> Materiais aceitos
          </strong>
          <div>
            {materialLabels.map((material) => (
              <span key={material}>{material}</span>
            ))}
          </div>
        </div>
      )}

      <section className="public-profile-reviews" aria-labelledby="profile-reviews-title">
        <div className="public-profile-reviews-heading">
          <div>
            <span>Experiências anteriores</span>
            <h3 id="profile-reviews-title">Avaliações recebidas</h3>
          </div>
          {reviewCount > 0 && <strong>{reviewCount}</strong>}
        </div>

        {loading ? (
          <p className="public-profile-feedback">Carregando avaliações...</p>
        ) : loadError ? (
          <p className="public-profile-feedback">{loadError}</p>
        ) : reviews.length === 0 ? (
          <p className="public-profile-feedback">
            Este perfil ainda não recebeu avaliações de trocas finalizadas.
          </p>
        ) : (
          <div className="public-profile-review-list">
            {reviews.map((review) => (
              <article className="public-profile-review" key={review.id}>
                <div className="public-profile-review-topline">
                  <div>
                    <strong>{review.avaliadorNome || "Pessoa da comunidade"}</strong>
                    <RatingStars value={review.nota} />
                  </div>
                  <time>{formatReviewDate(review.createdAt)}</time>
                </div>

                {review.comentario && (
                  <p>
                    <FaQuoteLeft aria-hidden="true" />
                    <span>{review.comentario}</span>
                  </p>
                )}

                {Array.isArray(review.destaques) && review.destaques.length > 0 && (
                  <div className="public-profile-review-tags">
                    {review.destaques.map((highlight) => (
                      <span key={highlight}>{highlight}</span>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </Alert>
  );
}
