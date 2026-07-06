import {
FaHome,
  FaNewspaper,
  FaComments,
  FaUser,
  FaBell,
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
      label: "Blog",
      icon: FaNewspaper,
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
    {
      to: "/notificacoes",
      label: "Notificações",
      icon: FaBell,
    },
    {
      to: "/perfil",
      label: "Meu Perfil",
      icon: FaUser,
    },
  ],

  "coletor-autonomo": [
    {
      to: "/blog",
      label: "Blog",
      icon: FaNewspaper,
    },
    {
      to: "/chat",
      label: "Chat",
      icon: FaComments,
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
      to: "/notificacoes",
      label: "Notificações",
      icon: FaBell,
    },
    {
      to: "/perfil",
      label: "Meu Perfil",
      icon: FaUser,
    },
  ],

  "instituicao-recicladora": [
    {
      to: "/dashboard",
      label: "Dashboard",
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
    {
      to: "/notificacoes",
      label: "Notificações",
      icon: FaBell,
    },
    {
      to: "/perfil",
      label: "Meu Perfil",
      icon: FaUser,
    },
  ],

  "centro-coleta": [
    {
      to: "/dashboard",
      label: "Dashboard",
      icon: FaChartBar,
    },
    {
      to: "/chat",
      label: "Chat",
      icon: FaComments,
    },
    {
      to: "/notificacoes",
      label: "Notificações",
      icon: FaBell,
    },
    {
      to: "/perfil",
      label: "Meu Perfil",
      icon: FaUser,
    },
  ],
};