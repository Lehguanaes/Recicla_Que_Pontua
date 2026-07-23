// ============================================================
// Recicla que Pontua — Paleta de Cores
// ============================================================

export const COLORS = {
  //Verde
  verdeEscuro: "var(--color-hex-2e7d32)",
  verdeMedio: "var(--color-hex-43a047)",
  verdeSuave: "var(--color-hex-c8e6c9)",
  verdeFundo: "var(--color-hex-f1f8e9)",
  
  //Marrom
  marrom: "var(--color-hex-6d4c41)",
  marromClaro: "var(--color-hex-8d6e63)",
  bege: "var(--color-hex-d7ccc8)",

  // Primária
  primary: 'var(--color-hex-6b1fa2)',        // roxo principal (header, botões primários)
  primaryLight: 'var(--color-hex-8b3fc4)',   // roxo claro (hover)
  primaryDark: 'var(--color-hex-4a1570)',    // roxo escuro (pressed)

  // Secundária
  secondary: 'var(--color-hex-4caf50)',      // verde (botões de ação, badges ativos)
  secondaryLight: 'var(--color-hex-81c784)',
  secondaryDark: 'var(--color-hex-388e3c)',

  // Detalhes
  orange: 'var(--color-hex-f59e0b)',


  // Neutros
  white: 'var(--color-hex-ffffff)',
  background: 'var(--color-hex-f5f5f5)',
  surface: 'var(--color-hex-ffffff)',
  border: 'var(--color-hex-e0e0e0)',
  divider: 'var(--color-hex-eeeeee)',

  // Texto
  textPrimary: 'var(--color-hex-212121)',
  textSecondary: 'var(--color-hex-757575)',
  textDisabled: 'var(--color-hex-bdbdbd)',
  textOnPrimary: 'var(--color-hex-ffffff)',

  // Status
  success: 'var(--color-hex-4caf50)',
  warning: 'var(--color-hex-ffc107)',
  error: 'var(--color-hex-f44336)',
  info: 'var(--color-hex-2196f3)',

  // Mapa / Marcadores
  markerCollector: 'var(--color-hex-6b1fa2)',  // catador autônomo
  markerCenter: 'var(--color-hex-2196f3)',     // centro de coleta
  markerSelected: 'var(--color-hex-ff5722)',

  // Rating
  ratingColor: 'var(--color-hex-e91e63)',

  // Outros
  overlayDark: 'var(--color-rgba-0-0-0-0p5)',
  cardShadow: 'var(--color-rgba-0-0-0-0p12)',
};

export const GRADIENTS = {
  primary: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryLight})`,
  header: `linear-gradient(180deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`,
};
