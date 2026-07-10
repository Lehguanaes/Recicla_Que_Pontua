import { FaLeaf, FaHeart, FaComment, FaPlay } from "react-icons/fa";

import "./comunidade.css";
import Mascote2 from "../../../assets/PetComecar.png";
import Thumb from "../../../components/comofunciona/Thumb";
import LockedAction from "../../../components/comofunciona/LockedAction";

import {
  artigosComunidade,
  videos,
  guias,
  extras,
} from "./ComunidadeData";

export default function Comunidade({

  onEntrar = () => console.log("entrar"),
  onCriarConta = () => console.log("criar conta"),
}) {
  return (
    <section id="comunidade" className="comunidade">
       <div className="comunidade-header">

    <div className="mascote-box">
      <div className="fala-mascote">
        <strong>Dica do Reci!</strong>

        <p>
          Aqui você encontra notícias, vídeos, guias e desafios para aprender
          mais sobre reciclagem.
        </p>
      </div>

      <img
        src={Mascote2}
        alt="Reci, o mascote"
      />
    </div>

    <div className="comunidade-texto">
      <h2>A comunidade continua depois do login.</h2>

      <p className="comunidade-intro">
        O <strong>Recicla que Pontua</strong> não é só um mapa de pontos de
        coleta. É também onde participantes contam o que aprenderam, a equipe
        publica guias e vídeos, e você acompanha seu próprio impacto.
      </p>
    </div>

  </div>

      <div className="section-inner">
        <div className="comunidade-layout">

          {/* Sidebar */}
          <aside className="comunidade-sidebar">

            <div className="comunidade-sidebar-label">
              Escrito pela comunidade
            </div>

            <p className="comunidade-sidebar-subtitle">
              Matérias enviadas por participantes do Recicla que Pontua.
            </p>

            {artigosComunidade.map((artigo) => (
              <div
                key={artigo.titulo}
                className="comunidade-article-card"
                onClick={onCriarConta}
              >
                <Thumb
                  icone={artigo.icone}
                  cor={artigo.cor}
                  size="sm"
                />

                <div>
                  <h4>{artigo.titulo}</h4>

                  <div className="comunidade-article-meta">
                    por <b>{artigo.autor}</b>
                  </div>

                  <span className="comunidade-article-tag">
                    {artigo.tag}
                  </span>
                </div>
              </div>
            ))}

          </aside>

          {/* Conteúdo principal */}

          <div className="comunidade-main">

            {/* Destaque */}

            <section>

              <div className="comunidade-section-head">
                <h3>Em destaque</h3>
              </div>

              <div className="comunidade-featured">

                <Thumb
                  icone={<FaLeaf />}
                  cor="b"
                  size="lg"
                />

                <div className="comunidade-featured-body">

                  <span className="comunidade-featured-label">
                    Reportagem
                  </span>

                  <h2 className="comunidade-featured-title">
                    De onde vem o que você recicla: uma visita aos centros parceiros
                  </h2>

                  <p className="comunidade-featured-text">
                    Acompanhamos uma tarde na cooperativa Vida Verde para entender
                    o que acontece com o material depois que ele sai da sua casa.
                  </p>

                  <div className="comunidade-featured-footer">

                    <button
                      className="comunidade-read-more"
                      onClick={onCriarConta}
                    >
                      Ler matéria completa
                      <span className="comunidade-arrow"> → </span>
                    </button>

                    <div className="comunidade-actions">
                      <LockedAction
                        icon={<FaHeart />}
                        label="Curtir"
                        count={128}
                      />

                      <LockedAction
                        icon={<FaComment />}
                        label="Comentar"
                        count={14}
                      />
                    </div>

                  </div>

                </div>

              </div>

            </section>

            {/* Vídeos */}

            <section>

              <div className="comunidade-section-head">
                <h3>Vídeos</h3>

                <button
                  className="link-btn"
                  onClick={onCriarConta}
                >
                  Ver todos
                </button>
              </div>

              <div className="comunidade-video-grid">

                {videos.map((video) => (

                  <div
                    key={video.titulo}
                    className="comunidade-video-card"
                  >

                    <div className="comunidade-video-thumb">

                      <Thumb
                        icone={video.icone}
                        cor={video.cor}
                        size="md"
                      />

                      <div className="comunidade-video-play">
                        <FaPlay />
                      </div>

                      <div className="comunidade-video-duration">
                        {video.duracao}
                      </div>

                    </div>

                    <h4>{video.titulo}</h4>

                    <div className="comunidade-video-footer">

                      <span>
                        Centro de aprendizagem
                      </span>

                      <LockedAction
                        icon={<FaHeart />}
                        label="Curtir"
                      />

                    </div>

                  </div>

                ))}

              </div>

            </section>

            {/* Guias */}
        <section className="comunidade-full-width">
            <section>
              <div className="comunidade-section-head">
                <h3>Guias</h3>
                <button
                  className="link-btn"
                  onClick={onCriarConta}
                > Ver todos
                </button>

              </div>

              <div className="comunidade-guide-grid">

                {guias.map((guia) => (

                  <div
                    key={guia.titulo}
                    className="comunidade-guide-card"
                    onClick={onCriarConta}
                  >

                    <div className="comunidade-guide-header">

                      <span className="comunidade-guide-icon">
                        {guia.icone}
                      </span>

                      <span className="comunidade-guide-level">
                        {guia.nivel}
                      </span>

                    </div>

                    <h4>{guia.titulo}</h4>

                    <div className="comunidade-guide-meta">
                      <span>{guia.aulas} aulas</span>
                      <span>{guia.duracao}</span>
                    </div>

                    <div className="comunidade-guide-progress">
                      <span />
                    </div>

                    <div className="comunidade-guide-cta">
                      Crie uma conta para acompanhar seu progresso.
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Impacto */}
            <section className="comunidade-impact">
              <div className="comunidade-impact-stat">
                <b>12kg</b> <span>reciclados</span>
              </div>
              <div className="comunidade-impact-stat">
                <b>340</b> <span>pontos</span>
              </div>

              <div className="comunidade-impact-stat">
                <b>3</b> <span>medalhas</span>
              </div>

              <div className="comunidade-impact-note">
                Esses números são apenas um exemplo.
                <button className="link-btn" onClick={onCriarConta}>
                  Crie uma conta
                </button>
                {" "}para acompanhar seu impacto real.
              </div>
            </section>

            {/* Extras */}
            <section>
              <div className="comunidade-section-head">
                <h3>E também</h3>
              </div>
              <div className="comunidade-extras-grid">
                {extras.map((extra) => (
                  <div
                    key={extra.titulo}
                    className="comunidade-extra-card">
                    <span className="comunidade-extra-icon"> {extra.icone} </span>
                    <h4>{extra.titulo}</h4>
                    <p>{extra.texto}</p>

                  </div>
                  ))}
                </div>
              </section>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}