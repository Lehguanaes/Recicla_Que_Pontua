import "../comoFunciona.css";

const artigos = [
  {
    fonte: "Artigo 01 · ACM",
    titulo: "Realidade virtual para ensinar triagem de plásticos",
    descricao:
      "Uma experiência imersiva permite ao usuário aprender a separar plásticos antes mesmo de visitar um centro físico, além de coletar feedback para melhorar o espaço real.",
    importancia:
      'Inspirou a criação de um conteúdo educativo ("cursinho") para orientar os usuários antes da entrega dos materiais.',
  },

  {
    fonte: "Artigo 02 · ACM",
    titulo: "Por que apps de sustentabilidade têm baixo engajamento",
    descricao:
      "Uma análise de mais de 70 aplicativos mostrou que a usabilidade influencia diretamente na permanência dos usuários.",
    importancia:
      "Justificou a implementação de gamificação, rankings, medalhas e estatísticas ambientais.",
  },

  {
    fonte: "Artigo 03 · Conferência",
    titulo: "Eco Green: rede social para reciclagem de plástico",
    descricao:
      "Apresenta reconhecimento de imagem para identificar plásticos e recomendação de negociações entre usuários.",
    importancia:
      "Influenciou a ideia dos filtros de busca e do futuro marketplace de materiais recicláveis.",
  },

  {
    fonte: "Artigo 04 · SciELO",
    titulo: "Economia circular na gestão de resíduos",
    descricao:
      "Mostra que economia circular depende da integração entre cidadãos, empresas e poder público.",
    importancia:
      "Reforçou a estrutura de múltiplos perfis de usuários e do chatbot educativo.",
  },

  {
    fonte: "Artigo 05 · WIEGO",
    titulo: "Catadores de recicláveis e mudanças climáticas",
    descricao:
      "Destaca a importância dos catadores na redução dos impactos ambientais, embora ainda sejam pouco valorizados.",
    importancia:
      "Foi a principal inspiração para colocar o catador como protagonista da plataforma.",
  },

  {
    fonte: "Artigo 06 · QCA Fuzzy",
    titulo: "Caminhos para a separação de lixo doméstico",
    descricao:
      "Conclui que não existe um único fator responsável pela reciclagem doméstica.",
    importancia:
      "Levou à decisão de oferecer diferentes formas de descarte, tornando a plataforma mais flexível.",
  },
];

const outrasLeituras = [
  "Repro — recompensas + CNN para coleta",
  "Chatbot persuasivo em Lima",
  "A fronteira verde dos apps de reciclagem",
  "Lixeira automática com Arduino",
  "Reciclagem em nuvem para cidades inteligentes",
  "Fechar o Ciclo — feedback via iBeacon",
  "Kariton — coleta móvel em economia circular",
];

export default function Pesquisa() {
  return (
    <section id="pesquisa" className="pesquisa">

      <div className="section-inner wide">

        <span className="eyebrow">
          02 · fundamentação científica
        </span>

        <h2>
          Não inventamos isso do zero.
        </h2>

        <p className="intro">
          Antes de desenhar qualquer tela, realizamos um levantamento
          bibliográfico em bases como ACM, IEEE e SciELO buscando pesquisas
          publicadas sobre reciclagem, economia circular, tecnologia,
          computação verde e educação ambiental.
        </p>

        <div className="research-grid">

          {artigos.map((artigo) => (

            <article
              className="research-card"
              key={artigo.titulo}
            >

              <span className="research-tag">
                {artigo.fonte}
              </span>

              <h3>{artigo.titulo}</h3>

              <p>{artigo.descricao}</p>

              <div className="why-strip">

                <strong>Por que importa?</strong>

                <p>{artigo.importancia}</p>

              </div>

            </article>

          ))}

        </div>

        <h3 className="other-title">
          Outras leituras que contribuíram para o projeto
        </h3>

        <div className="other-reads">

          {outrasLeituras.map((item) => (

            <span
              className="read-chip"
              key={item}
            >
              {item}
            </span>

          ))}

        </div>

      </div>

    </section>
  );
}