import "../comoFunciona.css";

export default function Hero() {
  return (
    <section className="hero reveal">
      <h1 className="hero-title">
        Por que o <span>Recicla que Pontua</span> é do jeito que é.
      </h1>

      <div className="hero-tags">

        <span className="hero-tag">
          Origem
        </span>

        <span className="hero-tag">
          Artigos consultados
        </span>

        <span className="hero-tag">
          Decisões de projeto
        </span>

        <span className="hero-tag">
          Fluxo atual
        </span>

      </div>

    </section>
  );
}