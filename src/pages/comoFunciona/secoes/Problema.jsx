import "../comoFunciona.css";

const desafios = [
  "Dificuldade em encontrar locais adequados para reciclagem",
  "Falta de praticidade no descarte dos materiais",
  "Baixo incentivo para a população participar",
  "Pouca conexão entre cidadãos, catadores e centros",
  "Necessidade de reforçar a conscientização ambiental",
];

export default function Problema() {
  return (
    <section id="problema" className="problema">

      <div className="section-inner reveal">

        <span className="eyebrow">
          01 · o ponto de partida
        </span>

        <h2>
          Todo mundo concorda que devia reciclar. Poucos conseguem.
        </h2>

        <p>
          A preocupação ambiental cresce, mas a reciclagem continua esbarrando no cotidiano. Muito material que poderia voltar à cadeia produtiva vira lixo comum e engorda aterros sanitários.
        </p>

        <p>
          A pergunta que abriu o projeto foi simples e um pouco desconfortável:
        </p>

        <blockquote className="question">
          "Por que muitas pessoas não reciclam, mesmo sabendo da importância disso?"
        </blockquote>

        <p>
          Fomos atrás das respostas e sempre esbarrávamos nos mesmos cinco obstáculos:
        </p>

        <div className="challenge-grid">
          {desafios.map((desafio) => (
            <div
              className="challenge-card"
              key={desafio}
            >
              {desafio}
            </div>
          ))}
        </div>

        <p className="closing-text">
          A plataforma nasceu como uma tentativa de atacar esses cinco pontos ao mesmo tempo, conectando quem descarta, quem coleta e quem compra.
        </p>

      </div>

    </section>
  );
}