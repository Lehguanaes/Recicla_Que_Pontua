import {
  FaLeaf,
  FaTruck,
  FaWarehouse,
  FaSchool,
  FaRecycle,
  FaSeedling,
  FaGraduationCap,
  FaSoap,
  FaBook,
  FaBookOpen,
  FaCalendarAlt,
  FaGlobeAmericas,
  FaHandHoldingHeart,
  FaRobot,
} from "react-icons/fa";

export const perfis = [
  { id: "reciclador", label: "Pessoa recicladora", icone: <FaLeaf />, resumo: "Notícias, dicas práticas, desafios semanais e um painel do seu impacto ambiental acumulado." },
  { id: "catador", label: "Catador", icone: <FaTruck />, resumo: "Solicitações de coleta na sua região, novas oportunidades, mensagens e estatísticas de atendimento." },
  { id: "centro", label: "Centro de reciclagem", icone: <FaWarehouse />, resumo: "Gestão dos materiais aceitos, indicadores de coleta e canal direto com os usuários da plataforma." },
  { id: "instituicao", label: "Instituição de ensino", icone: <FaSchool />, resumo: "Acompanhamento de campanhas internas, ranking entre escolas e desempenho dos participantes." },
];

export const artigosComunidade = [
  { titulo: "Como reduzi meu lixo em 60% em 3 meses", autor: "Rafael Tavares", tag: "participante", icone: <FaRecycle />, cor: "a" },
  { titulo: "Composteira de apartamento: o que aprendi errando", autor: "Beatriz Lima", tag: "participante", icone: <FaSeedling />, cor: "b" },
  { titulo: "Levei a reciclagem pra escola dos meus filhos", autor: "Diego Andrade", tag: "participante", icone: <FaGraduationCap />, cor: "c" },
];

export const videos = [
  { titulo: "Como higienizar embalagens antes de reciclar", duracao: "4:12", icone: <FaSoap />, cor: "b" },
  { titulo: "Plástico, vidro, papel: o que pode e o que não pode", duracao: "6:03", icone: <FaRecycle />, cor: "c" },
  { titulo: "Compostagem em 5 passos simples", duracao: "5:47", icone: <FaSeedling />, cor: "a" },
  { titulo: "Compostagem em 5 passos simples", duracao: "5:47", icone: <FaSeedling />, cor: "a" },
];

export const guias = [
  { titulo: "Reciclagem para iniciantes", nivel: "Iniciante", aulas: 6, duracao: "45 min", icone: <FaBook /> },
  { titulo: "Compostagem doméstica", nivel: "Intermediário", aulas: 8, duracao: "1h10", icone: <FaBookOpen /> },
  { titulo: "Educação ambiental em sala de aula", nivel: "Educadores", aulas: 5, duracao: "40 min", icone: <FaGraduationCap /> },
];

export const extras = [
  { icone: <FaCalendarAlt />, titulo: "Eventos", texto: "Mutirões, feiras e campanhas perto de você." },
  { icone: <FaGlobeAmericas />, titulo: "Curiosidades", texto: "Tempo de decomposição e dados de reciclagem." },
  { icone: <FaHandHoldingHeart />, titulo: "Projetos parceiros", texto: "Cooperativas e ONGs parceiras da plataforma." },
  { icone: <FaRobot />, titulo: "Assistente virtual", texto: "Tira dúvidas sobre descarte, na hora." },
];
