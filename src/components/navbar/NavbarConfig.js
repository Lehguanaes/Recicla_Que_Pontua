import {
  FaHome,
  FaComments,
  FaRecycle,
  FaTrophy,
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
      label: "Como Reciclar",
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
      to: "/chat",
      label: "Chat",
      icon: FaComments,
    },
  ],

  "coletor-autonomo": [
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
