import "../comoFunciona.css";

const decisoes = [
  {
    numero: "01",
    pergunta:
      "Só conectar centros de reciclagem já resolve, ou catadores também deveriam entrar?",
    status: "Decidido",
    decisao:
      "Catadores autônomos e cooperativas podem se cadastrar como participantes com a mesma importância dos centros.",
    porque:
      "Os catadores respondem por grande parte da coleta de recicláveis no Brasil. Ignorá-los seria construir um sistema distante da realidade.",
  },

  {
    numero: "02",
    pergunta:
      "O usuário sempre precisa levar o material ou também pode solicitar coleta?",
    status: "Decidido",
    decisao:
      "A plataforma oferece duas possibilidades: entrega em centros parceiros ou solicitação de coleta realizada por um catador.",
    porque:
      "Nem todos conseguem transportar grandes quantidades de materiais recicláveis.",
  },

  {
    numero: "03",
    pergunta:
      "Créditos no aplicativo substituem o pagamento em dinheiro?",
    status: "Modelo híbrido",
    decisao:
      "Coletas realizadas por catadores podem gerar pagamento em dinheiro. Já entregas em centros parceiros geram créditos utilizáveis na plataforma.",
    porque:
      "Dessa forma, cada usuário escolhe a modalidade que faz mais sentido para sua realidade.",
  },

  {
    numero: "04",
    pergunta:
      "É possível transformar reciclagem em atividade escolar?",
    status: "Decidido",
    decisao:
      "Instituições de ensino possuem perfis próprios com rankings e acompanhamento de desempenho.",
    porque:
      "A competição saudável aumenta o engajamento dos alunos.",
  },

  {
    numero: "05",
    pergunta:
      "Como confiar em pessoas desconhecidas?",
    status: "Decidido",
    decisao:
      "Após cada interação os usuários podem realizar avaliações e registrar denúncias.",
    porque:
      "O histórico de reputação aumenta a confiança entre os participantes.",
  },

  {
    numero: "06",
    pergunta:
      "Como acontece a comunicação entre usuário e catador?",
    status: "Fluxo fechado",
    decisao:
      "O chat só é liberado após a aceitação da solicitação pelo catador.",
    porque:
      "Isso evita contatos desnecessários e mantém o processo organizado.",
  },

  {
    numero: "07",
    pergunta:
      "Como ensinar reciclagem sem tornar o processo cansativo?",
    status: "Decidido",
    decisao:
      "Um chatbot educativo responde dúvidas e apresenta orientações sobre separação e limpeza dos materiais.",
    porque:
      "Grande parte dos erros ocorre por falta de orientação simples no momento certo.",
  },
];

export default function Decisoes() {
  return (
    <section id="decisoes" className="decisoes">

      <div className="section-inner">

        <span className="eyebrow">
          03 · processo de decisão
        </span>

        <h2>
          Cada dúvida encontrada durante o desenvolvimento resultou em uma decisão de projeto.
        </h2>

        <p className="intro">
          Durante todo o desenvolvimento, cada problema identificado era discutido
          antes da implementação da solução seguinte. Esse processo orientou toda
          a construção da plataforma.
        </p>

        <div className="timeline">

          {decisoes.map((item) => (

            <article
              className="timeline-card"
              key={item.numero}
            >

              <div className="timeline-number">
                {item.numero}
              </div>

              <span className="timeline-status">
                {item.status}
              </span>

              <h3>{item.pergunta}</h3>

              <p>
                <strong>Decisão:</strong> {item.decisao}
              </p>

              <p>
                <strong>Justificativa:</strong> {item.porque}
              </p>

            </article>

          ))}

        </div>

      </div>

    </section>
  );
}