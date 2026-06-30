// ============================================================
// Recicla que Pontua — Paleta de Cores
// ============================================================

export const COLORS = {
  //Verde
  verdeEscuro: "#2E7D32",
  verdeMedio: "#43A047",
  verdeSuave: "#C8E6C9",
  verdeFundo: "#F1F8E9",
  
  //Marrom
  marrom: "#6D4C41",
  marromClaro: "#8D6E63",
  bege: "#D7CCC8",

  // Primária
  primary: '#6B1FA2',        // roxo principal (header, botões primários)
  primaryLight: '#8B3FC4',   // roxo claro (hover)
  primaryDark: '#4A1570',    // roxo escuro (pressed)

  // Secundária
  secondary: '#4CAF50',      // verde (botões de ação, badges ativos)
  secondaryLight: '#81C784',
  secondaryDark: '#388E3C',

  // Detalhes
  orange: '#f59e0b',


  // Neutros
  white: '#FFFFFF',
  background: '#F5F5F5',
  surface: '#FFFFFF',
  border: '#E0E0E0',
  divider: '#EEEEEE',

  // Texto
  textPrimary: '#212121',
  textSecondary: '#757575',
  textDisabled: '#BDBDBD',
  textOnPrimary: '#FFFFFF',

  // Status
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#F44336',
  info: '#2196F3',

  // Mapa / Marcadores
  markerCollector: '#6B1FA2',  // catador autônomo
  markerCenter: '#2196F3',     // centro de coleta
  markerSelected: '#FF5722',

  // Rating
  ratingColor: '#E91E63',

  // Outros
  overlayDark: 'rgba(0,0,0,0.5)',
  cardShadow: 'rgba(0,0,0,0.12)',
};

export const GRADIENTS = {
  primary: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryLight})`,
  header: `linear-gradient(180deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`,
};
