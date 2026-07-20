import {
  FaHome,
  FaComments,
  FaRecycle,
  FaChartBar,
  FaTrophy,
  FaGift,
} from "react-icons/fa";

export const navbarPorPerfil = {
  visitante: [
    {
      to: "/",
      label: "Início",
      icon: FaHome,
    },
    {
      to: "/comoFunciona",
      label: "Como Funciona",
      icon: FaRecycle,
    },
    {
      to: "/ranking",
      label: "Ranking",
      icon: FaTrophy,
    },
    {
      to: "/recompensas",
      label: "Recompensas",
      icon: FaGift,
    },
  ],

  "pessoa-recicladora": [
    {
      to: "/blog",
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
      to: "/chat",
      label: "Chat",
      icon: FaComments,
    },
  ],

  "coletor-autonomo": [
    {
      to: "/blog",
      label: "Principal",
      icon: FaHome,
    },
    {
      to: "/estatisticas",
      label: "Estatísticas",
      icon: FaChartBar,
    },
    {
      to: "/ranking",
      label: "Ranking",
      icon: FaTrophy,
    },
    {
      to: "/chat",
      label: "Chat",
      icon: FaComments,
    },
  ],

  "instituicao-recicladora": [
    {
      to: "/dashboard",
      label: "Principal",
      icon: FaHome,
    },
    {
      to: "/ranking",
      label: "Ranking",
      icon: FaTrophy,
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
      to: "/chat",
      label: "Chat",
      icon: FaComments,
    },
  ],
};