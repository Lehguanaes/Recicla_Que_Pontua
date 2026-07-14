import { FaLeaf, FaHeart, FaComment, FaPlay } from "react-icons/fa";
import {artigosComunidade, videos, guias, extras,} from "../ComunidadeData";
import Thumb from "../../../../components/comofunciona/Thumb";
import LockedAction from "../../../../components/comofunciona/LockedAction";

export default function Conteudo(
    onEntrar = () => console.log("entrar"),
    onCriarConta = () => console.log("criar conta"),
){

    return(
    <div className="section-inner">
        <div className="comunidade-layout">

          {/* Sidebar */}
          <aside className="comunidade-sidebar">
            <div className="comunidade-sidebar-label">
              Escrito pela comunidade
            </div>
            <p className="comunidade-sidebar-subtitle"> Matérias enviadas por participantes do Recicla que Pontua.</p>

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
                    <span className="comunidade-extra-icon"> 
                      {extra.icone} 
                      </span>
                    <h4>{extra.titulo}</h4>
                    <p>{extra.texto}</p>

                  </div>
                  ))}
                </div>
              </section>
            </section>
          </div>
        </div>

        <style>{`
          .comunidade{
              max-width:1200px;
              margin:0 auto;
              padding:0 2rem 4rem;
          }

          .section-inner{
              width:100%;
          }
          .comunidade-layout {
                  display: grid;
                  grid-template-columns: 280px 1fr;
                  gap: 40px;
                  align-items: start;
                  margin-bottom: 56px;
                  }

                  @media (max-width: 900px) {
                  .comunidade-layout {
                      grid-template-columns: 1fr;
                      }
                  }

          .comunidade-sidebar{
              display:flex;
              flex-direction:column;
              gap:14px;
              top:24px;
          }

          .comunidade-sidebar-label{font-size:.95rem;}

          .comunidade-sidebar-subtitle{
              margin:-8px 0 4px;
              font-size:.85rem;
          }

          .comunidade-article-card{
              display:flex;
              gap:12px;
              padding:12px;
              cursor:pointer;
          }

          .comunidade-article-card h4{
              font-size:.9rem;
              line-height:1.3;
              margin-bottom:4px;
          }

          .comunidade-article-meta{
              margin-bottom:6px;
              font-size:.78rem;
          }

          .comunidade-main{
              display:flex;
              flex-direction:column;
              gap:40px;
          }

          /* Destaque */
          .comunidade-featured{
              display:grid;
              grid-template-columns:220px 1fr;
              gap:24px;
              padding:20px;
              border-radius:18px;
          }

          .comunidade-featured-label{font-size:.75rem;}

          .comunidade-featured-title{
              margin:6px 0 10px;
              font-size:1.3rem;
              line-height:1.35;
          }

          .comunidade-featured-text{
              margin-bottom:16px;
              font-size:.92rem;
              line-height:1.55;
          }

          .comunidade-featured-footer{
              display:flex;
              justify-content:space-between;
              align-items:center;
              flex-wrap:wrap;
              gap:12px;
          }

          .comunidade-read-more{
              display:flex;
              align-items:center;
              background:none;
              border:none;
              cursor:pointer;
          }

          .comunidade-arrow{transition:.2s;}

          .comunidade-read-more:hover .comunidade-arrow{transform:translateX(4px);}

          .comunidade-actions{
              display:flex;
              gap:16px;
          }

          /* Vídeos */
          .comunidade-video-grid{
              display:grid;
              grid-template-columns:repeat(3,1fr);
              gap:20px;
          }

          .comunidade-video-thumb{
              position:relative;
              display:flex;
              justify-content:center;
              align-items:center;
              aspect-ratio:16/10;
          }

          .comunidade-video-play{
              position:absolute;
              inset:0;
              display:flex;
              justify-content:center;
              align-items:center;
              opacity:0;
              transition:.2s;
          }

          .comunidade-video-card:hover .comunidade-video-play{opacity:1;}

          .comunidade-video-duration{
              position:absolute;
              right:8px;
              bottom:8px;
              padding:2px 6px;
              border-radius:6px;
              font-size:.7rem;
          }

          .comunidade-video-card h4{
              padding:12px 12px 4px;
              font-size:.9rem;
          }

          .comunidade-video-footer{
              display:flex;
              justify-content:space-between;
              align-items:center;
              padding:0 12px 12px;
              font-size:.8rem;
          }

          .comunidade-full-width{
              display:flex;
              flex-direction:column;
              gap:35px;
              width:100%;
              margin-top:55px;
          }
          .comunidade-guide-icon{
            color: rgba(64, 153, 67, 0.85);
          }
          .comunidade-guide-grid{
              display:grid;
              grid-template-columns:repeat(3,1fr);
              gap:24px;
          }

          .comunidade-guide-card{
              padding:16px;
              cursor:pointer;
              border-radius: 15px;
              border:1px solid #e3ebe3;
          }
          .comunidade-guide-card:hover{
            border-color:#43a047;
            box-shadow:0 8px 20px rgba(0,0,0,.06);
          }

          .comunidade-guide-header{
              display:flex;
              justify-content:space-between;
              align-items:center;
              margin-bottom:10px;
          }

          .comunidade-guide-icon{font-size:1.3rem;}

          .comunidade-guide-card h4{
              margin-bottom:8px;
              font-size:.95rem;
          }

          .comunidade-guide-meta{
              display:flex;
              gap:12px;
              margin-bottom:10px;
              font-size:.78rem;
          }

          .comunidade-guide-progress{
              overflow:hidden;
              height:6px;
              margin-bottom:10px;
              border-radius:999px;
          }

          .comunidade-guide-progress span{
              display:block;
              width:0;
              height:100%;
          }

          @media(max-width:900px){
              .comunidade-video-grid,
              .comunidade-guide-grid{
                  grid-template-columns:1fr;
              }
          }

          @media(max-width:640px){
              .comunidade-featured{
                  grid-template-columns:1fr;
              }
          }

          /* Extras */
          .comunidade-extras-grid{
              display:grid;
              grid-template-columns:repeat(4,1fr);
              gap:16px;
          }

          .comunidade-extra-card{padding:16px;}

          .comunidade-extra-icon{
              width:36px;
              height:36px;
              margin-bottom:10px;
              font-size:1.1rem;
               color: rgba(64, 153, 67, 0.85);
          }

          .comunidade-extra-card h4{
              margin-bottom:4px;
              font-size:.9rem;
          }

          .comunidade-extra-card p{
              font-size:.8rem;
              line-height:1.5;
          }

          /* Perfil */
          .comunidade-perfil-tabs{margin-bottom:56px;}

          .comunidade-perfil-tabs-list{
              display:flex;
              flex-wrap:wrap;
              gap:10px;
              margin-bottom:20px;
          }

          .comunidade-perfil-tab-btn.active{background:var(--secondary-dark);}

          .comunidade-perfil-tab-icon{font-size:1rem;}

          .comunidade-perfil-panel-icon{
              width:48px;
              height:48px;
              font-size:1.3rem;
          }

          .comunidade-perfil-panel h4{
              margin-bottom:6px;
              font-size:1rem;
          }

          .comunidade-perfil-panel p{
              font-size:.88rem;
              line-height:1.55;
          }

          /* CTA */
          .comunidade-cta-wrapper{margin-top:24px;}

          .comunidade-cta-card{grid-template-columns:1fr auto;}

          .comunidade-cta-card h3{
              margin:14px 0 10px;
              font-size:1.6rem;
          }

          .comunidade-cta-card p{max-width:520px;}

          .comunidade-cta-seal-inner{
              width:120px;
              height:120px;
          }

          .comunidade-cta-seal-icon{font-size:1.6rem;}

          .comunidade-cta-seal-text{font-size:.7rem;}

          @media(max-width:900px){
              .comunidade-extras-grid{
                  grid-template-columns:repeat(2,1fr);
              }
          }

          @media(max-width:800px){
              .comunidade-impact{
                  grid-template-columns:repeat(3,1fr);
              }
              .comunidade-impact-note{
                  grid-column:1/-1;
              }
          }

          @media(max-width:700px){
              .comunidade-cta-card{
                  grid-template-columns:1fr;
                  text-align:center;
              }
          }
          `}</style>


      </div>
    );
 }
