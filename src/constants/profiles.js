export const PROFILE_IDS = {
  PERSON: "pessoa-recicladora",
  COLLECTOR: "coletor-autonomo",
  INSTITUTION: "instituicao-recicladora",
  CENTER: "centro-coleta",
};

export const PROFILE_TYPES = {
  [PROFILE_IDS.PERSON]: {
    id: PROFILE_IDS.PERSON,
    label: "Pessoa Recicladora",
    description:
      "Moradores, condomínios e estabelecimentos que separam e destinam corretamente seus resíduos recicláveis.",
  },
  [PROFILE_IDS.COLLECTOR]: {
    id: PROFILE_IDS.COLLECTOR,
    label: "Coletor Autônomo",
    description:
      "Profissional que coleta, separa e comercializa materiais recicláveis, contribuindo para a economia circular e a preservação ambiental.",
  },
  [PROFILE_IDS.INSTITUTION]: {
    id: PROFILE_IDS.INSTITUTION,
    label: "Instituição Recicladora",
    description:
      "Escolas, universidades e instituições que promovem educação ambiental e ações de reciclagem junto à comunidade.",
  },
  [PROFILE_IDS.CENTER]: {
    id: PROFILE_IDS.CENTER,
    label: "Centro de Reciclagem",
    description:
      "Ecopontos, cooperativas, sucateiros e empresas que recebem, armazenam, compram ou encaminham materiais para reciclagem.",
  },
};

export const PROFILE_OPTIONS = Object.values(PROFILE_TYPES);

const PROFILE_ALIASES = {
  pessoa: PROFILE_IDS.PERSON,
  reciclador: PROFILE_IDS.PERSON,
  instituicao: PROFILE_IDS.INSTITUTION,
  coletor: PROFILE_IDS.COLLECTOR,
  catador: PROFILE_IDS.COLLECTOR,
  centro: PROFILE_IDS.CENTER,
};

export function getProfileLabel(profileId, fallback = "Usuário") {
  const normalizedId = PROFILE_ALIASES[profileId] || profileId;
  return PROFILE_TYPES[normalizedId]?.label || profileId || fallback;
}
