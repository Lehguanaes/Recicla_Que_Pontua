import "./selecionarUser.css";
import ProfileCard from "../profileCard/ProfileCard";

import Catador from "../../../../assets/rec-icon.png";
import CentroColeta from "../../../../assets/rec-icon.png";
import Instituicao from "../../../../assets/rec-icon.png";
import PessoaRec from "../../../../assets/rec-icon.png";

export const perfis = [
  {
    id: "pessoa-recicladora",
    image: PessoaRec,
    label: "Pessoa Recicladora",
    description: "Ideal para moradores, condomínios e pequenos comércios que desejam vender ou doar materiais recicláveis.",
  },
  {
    id: "catador-autonomo",
    image: Catador,
    label: "Catador Autônomo",
    description: "Receba solicitações de coleta, informe os materiais que coleta e acumule pontos pelas coletas realizadas.",
  },
  {
    id: "instituicao-recicladora",
    image: Instituicao,
    label: "Instituição Recicladora",
    description: "Gerencie coletas e impacto ambiental da sua instituição.",
  },
  {
    id: "centro-coleta",
    image: CentroColeta,
    label: "Centro de Reciclagem",
    description: "Cadastre sua empresa, informe os materiais aceitos, preços pagos e gerencie o recebimento de recicláveis."
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

