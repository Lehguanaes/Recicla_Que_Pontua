import "./selecionarUser.css";
import ProfileCard from "../profileCard/ProfileCard";

import Catador from "../../../../assets/catador.png";
import CentroColeta from "../../../../assets/centrocoleta.png";
import Instituicao from "../../../../assets/instituicao.png";
import PessoaRec from "../../../../assets/pessoa-recicladora.png";

export const perfis = [
  {
    id: "pessoa-recicladora",
    image: PessoaRec,
    label: "Pessoa Recicladora",
    description: 
    "Moradores, condomínios e estabelecimentos que separam e destinam corretamente seus resíduos recicláveis.",
  },
  {
    id: "catador-autonomo",
    image: Catador,
    label: "Catador Autônomo",
    description: 
    "Profissional que coleta, separa e comercializa materiais recicláveis, contribuindo para a economia circular e a preservação ambiental.",
  },
  {
    id: "instituicao-recicladora",
    image: Instituicao,
    label: "Instituição Recicladora",
    description: "Escolas, universidades e instituições que promovem educação ambiental e ações de reciclagem junto à comunidade.",
  },
  {
    id: "centro-coleta",
    image: CentroColeta,
    label: "Centro de Reciclagem",
    description: 
    "Eco pontos, cooperativas, sucateiros e empresas que recebem, armazenam, compram ou encaminham materiais para reciclagem."
,
  },
];

export default function SelecionarUser({ selected, onSelect }) {
  return (
    <div className="select-user">
      <h3 className="titulo">Primeiro, quem é você?</h3>
      <p className="descrition">Selecione o perfil que melhor descreve você para personalizar seu cadastro.</p>
          

      <div className="select-user-grid">
        {perfis.map((perfil) => (
          <ProfileCard
            key={perfil.id}
            image={perfil.image}
            name={perfil.label} 
            description={perfil.description}
            selected={selected === perfil.id}
            onSelect={() => onSelect(perfil.id)}
          />
        ))}
      </div>
    </div>
  );
}

