import Mascote from "../../../../assets/PetComecar.png";

export default function Header(){


    return(
    <div className="comunidade-header">
        <div className="mascote-box">
            <div className="fala-mascote">
                <strong>Dica do Reci!</strong>
        
                <p>Aqui você encontra notícias, vídeos, guias e desafios para aprender mais sobre reciclagem.</p>
            </div>
                <img src={Mascote} alt="Reci, o mascote"/>
        </div>
        
        <div className="comunidade-texto">
            <h2>A comunidade continua depois do login.</h2>
        
            <p className="comunidade-intro">
            O <strong>Recicla que Pontua</strong> não é só um mapa de pontos de coleta. É também onde participantes contam o que aprenderam, a equipe publica guias e vídeos, e você acompanha seu próprio impacto.</p>
        </div>
    
    <style>{`
        .comunidade-header{
        display:flex;
        justify-content:space-between;
        align-items:center;
        gap:4rem;
        margin:3rem 2rem 4rem;
        }
        
        @media (max-width: 768px) {
        .comunidade-header {
            display: none;
        }
        }
        .comunidade-texto{
            flex:1;
            max-width:650px;
        }

        .comunidade-texto h2{
        margin:.5rem 0 1rem;
        color: var(--orange);
        }

        .comunidade-intro{
            color:#4b5f52;
            line-height:1.8;
            font-size:1.05rem;
        }

        .mascote-box{
            display:flex;
            align-items:flex-end;
            gap:1rem;
        }

        .mascote-box img{
            width:140px;
            height:auto;
            filter:drop-shadow(0 8px 18px rgba(0,0,0,.12));
        }

        .fala-mascote{
            position:relative;
            width:280px;
            background:#fff;
            border-radius:18px;
            padding:1rem 1.2rem;
            border:1px solid #dfe9df;
            box-shadow:0 12px 30px rgba(0,0,0,.08);
        }

        .fala-mascote::after{
            content:"";
            position:absolute;
            right:-10px;
            bottom:24px;
            width:18px;
            height:18px;
            background:#fff;
            transform:rotate(45deg);
            border-top:1px solid #dfe9df;
            border-right:1px solid #dfe9df;
        }

        .fala-mascote strong{
            display:block;
            color:#2f8d46;
            margin-bottom:.5rem;
        }

        .fala-mascote p{
            margin:0;
            line-height:1.6;
            color:#4b5f52;
        }
        .comunidade-section-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 18px;
        }

        .comunidade-section-head h3 {
        font-size: 1.25rem;
        font-weight: 700;
        color: #1f3525;
        }
        `}
        </style>
    </div>
    );
}