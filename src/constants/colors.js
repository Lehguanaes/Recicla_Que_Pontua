// ============================================================
// Recicla que Pontua — Paleta de Cores
// ============================================================

export const COLORS = {
  //Verde
  verdeEscuro: "var(--color-brand-green-deep)",
  verdeMedio: "var(--color-brand-green-medium)",
  verdeSuave: "var(--color-brand-green-soft)",
  verdeFundo: "var(--color-surface-green)",
  
  //Marrom
  marrom: "var(--color-brown)",
  marromClaro: "var(--color-brown-light)",
  bege: "var(--color-beige)",

  // Primária
  primary: 'var(--color-purple)',        // roxo principal (header, botões primários)
  primaryLight: 'var(--color-purple-light)',   // roxo claro (hover)
  primaryDark: 'var(--color-purple-dark)',    // roxo escuro (pressed)

  // Secundária
  secondary: 'var(--color-success)',      // verde (botões de ação, badges ativos)
  secondaryLight: 'var(--color-brand-green-light)',
  secondaryDark: 'var(--color-brand-green-dark)',

  // Detalhes
  orange: 'var(--color-brand-orange)',


  // Neutros
  white: 'var(--color-surface-card)',
  background: 'var(--color-surface-page)',
  surface: 'var(--color-surface-card)',
  border: 'var(--color-border)',
  divider: 'var(--color-divider)',

  // Texto
  textPrimary: 'var(--color-text-default)',
  textSecondary: 'var(--color-text-muted)',
  textDisabled: 'var(--color-text-disabled)',
  textOnPrimary: 'var(--color-surface-card)',

  // Status
  success: 'var(--color-success)',
  warning: 'var(--color-warning)',
  error: 'var(--color-danger)',
  info: 'var(--color-info)',

  // Mapa / Marcadores
  markerCollector: 'var(--color-purple)',  // catador autônomo
  markerCenter: 'var(--color-info)',     // centro de coleta
  markerSelected: 'var(--color-marker-selected)',

  // Rating
  ratingColor: 'var(--color-rating)',

  // Outros
  overlayDark: 'rgb(var(--rgb-black) / 0.5)',
  cardShadow: 'rgb(var(--rgb-black) / 0.12)',
};

export const GRADIENTS = {
  primary: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryLight})`,
  header: `linear-gradient(180deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`,
};
