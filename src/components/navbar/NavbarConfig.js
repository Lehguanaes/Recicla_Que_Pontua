import {
  FaHome,
  FaComments,
  FaRecycle,
  FaTrophy,
  FaUserPlus,
} from "react-icons/fa";

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

  "pessoa-recicladora": [
    {
      to: "/como-reciclar",
      label: "Principal",
      icon: FaHome,
    },
    {
      to: "/doacao/cadastrar-materiais",
      label: "Reciclar",
      icon: FaRecycle,
    },
    {
      to: "/ranking",
      label: "Ranking",
      icon: FaTrophy,
    },
     {
      to: "/convites",
      label: "Convites",
      icon: FaUserPlus,
    },
    {
      to: "/chat",
      label: "Chat",
      icon: FaComments,
    },
  ],

  "coletor-autonomo": [
    {
      to: "/ranking",
      label: "Ranking",
      icon: FaTrophy,
    },
    {
      to: "/convites",
      label: "Convites",
      icon: FaUserPlus,
    },
    {
      to: "/chat",
      label: "Chat",
      icon: FaComments,
    },
  ],

  "instituicao-recicladora": [
    {
      to: "/como-reciclar",
      label: "Principal",
      icon: FaHome,
    },
    {
      to: "/doacao/cadastrar-materiais",
      label: "Reciclar",
      icon: FaRecycle,
    },
    {
      to: "/ranking",
      label: "Ranking",
      icon: FaTrophy,
    },
    {
      to: "/convites",
      label: "Convites",
      icon: FaUserPlus,
    },
    {
      to: "/chat",
      label: "Chat",
      icon: FaComments,
    },
  ],

  "centro-coleta": [
    {
      to: "/dashboard",
      label: "Principal",
      icon: FaHome,
    },
    {
      to: "/convites",
      label: "Convites",
      icon: FaUserPlus,
    },
    {
      to: "/chat",
      label: "Chat",
      icon: FaComments,
    },
  ],
};
