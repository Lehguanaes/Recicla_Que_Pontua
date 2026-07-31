import "./selecionarUser.css";
import ProfileCard from "../profileCard/ProfileCard";

import Catador from "../../../assets/catador.png";
import CentroColeta from "../../../assets/centrocoleta.png";
import Instituicao from "../../../assets/instituicao.png";
import PessoaRec from "../../../assets/pessoa-recicladora.png";
import { PROFILE_OPTIONS, PROFILE_IDS } from "../../../constants/profiles";

const PROFILE_IMAGES = {
  [PROFILE_IDS.PERSON]: PessoaRec,
  [PROFILE_IDS.COLLECTOR]: Catador,
  [PROFILE_IDS.INSTITUTION]: Instituicao,
  [PROFILE_IDS.CENTER]: CentroColeta,
};

export default function SelecionarUser({ selected, onSelect }) {
  return (
    <div className="select-user">
      <h3 className="titulo">Escolha seu perfil</h3>
      <p className="description">Selecione o perfil que melhor descreve você para personalizar seu cadastro.</p>
          

      <div className="select-user-grid">
        {PROFILE_OPTIONS.map((perfil) => (
          <ProfileCard
            key={perfil.id}
            image={PROFILE_IMAGES[perfil.id]}
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

