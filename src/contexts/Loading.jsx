// Imagem do mascote utilizada na tela de carregamento
import Mascote from "../assets/PetComecar.png";

// Estilos do componente
import "./loading.css";

/**
 * Componente de carregamento da aplicação
 *
 * Props:
 * - mensagem: texto exibido abaixo do mascote
 */
export default function Loading({ mensagem = "Carregando" }) {
  return (
    <div className="loading-overlay">
      <div className="loading-content">

        {/* Área principal do mascote */}
        <div className="mascote-wrap">

          {/* Efeitos decorativos de brilho ao redor do mascote */}
          <span className="sparkle sparkle-1">
            <RecycleStar />
          </span>

          <span className="sparkle sparkle-2">
            <RecycleStar />
          </span>

          <span className="sparkle sparkle-3">
            <RecycleStar />
          </span>

          <span className="sparkle sparkle-4">
            <RecycleStar />
          </span>

          {/* Imagem do mascote */}
          <img
            src={Mascote}
            alt="Mascote Recicla que Pontua"
            className="mascote-img"
          />
        </div>

        {/* Mensagem e animação de carregamento */}
        <div
          className="loading-row"
          role="status"
          aria-live="polite"
        >
          <span className="loading-label">
            {mensagem}
          </span>

          {/* Animação dos três pontos */}
          <span
            className="dot-pulse"
            aria-hidden="true"
          >
            <span className="dp" />
            <span className="dp" />
            <span className="dp" />
          </span>
        </div>

      </div>
    </div>
  );
}

/**
 * Ícone decorativo em formato de estrela
 * utilizado nos brilhos ao redor do mascote.
 */
function RecycleStar() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="#69f0ae"
      aria-hidden="true"
    >
      <path d="M10 0l1.8 8.2L20 10l-8.2 1.8L10 20l-1.8-8.2L0 10l8.2-1.8z" />
    </svg>
  );
}
