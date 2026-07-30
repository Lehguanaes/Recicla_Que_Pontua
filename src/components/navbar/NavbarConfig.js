import {
  FaHome,
  FaComments,
  FaHandsHelping,
  FaPaperPlane,
  FaRecycle,
  FaTrophy,
} from "react-icons/fa";

const menuReciclador = [
  { to: "/", label: "Início", icon: FaHome },
  { to: "/como-reciclar", label: "Como reciclar", icon: FaRecycle },
  { to: "/doacao/cadastrar-materiais", label: "Reciclar", icon: FaHandsHelping },
  { to: "/convites", label: "Convites", icon: FaPaperPlane },
  { to: "/chat", label: "Chat", icon: FaComments },
  { to: "/ranking", label: "Ranking", icon: FaTrophy },
];

export const navbarPorPerfil = {
  visitante: [
    {
      to: "/",
      label: "Início",
      icon: FaHome,
    },
    {
      to: "/como-reciclar",
      label: "Como reciclar",
      icon: FaRecycle,
    },
    {
      to: "/ranking",
      label: "Ranking",
      icon: FaTrophy,
    },
  ],

  "pessoa-recicladora": menuReciclador,

  "coletor-autonomo": [
    {
      to: "/",
      label: "Início",
      icon: FaHome,
    },
    {
      to: "/ranking",
      label: "Ranking",
      icon: FaTrophy,
    },
    {
      to: "/convites",
      label: "Convites",
      icon: FaPaperPlane,
    },
    {
      to: "/chat",
      label: "Chat",
      icon: FaComments,
    },
  ],

  "instituicao-recicladora": menuReciclador,

  "centro-coleta": [
    {
      to: "/",
      label: "Início",
      icon: FaHome,
    },
    {
      to: "/convites",
      label: "Convites",
      icon: FaPaperPlane,
    },
    {
      to: "/chat",
      label: "Chat",
      icon: FaComments,
    },
  ],
};
