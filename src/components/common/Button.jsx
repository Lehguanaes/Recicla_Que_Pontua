import React from 'react';
import { COLORS } from '../../constants';

const variants = {
  primary: {
    background: 'var(--color-transparent)',
    color: COLORS.orange,
    border: `1.5px solid ${COLORS.orange}`,
  },
  secondary: {
    background: COLORS.secondary,
    color: COLORS.white,
    border: 'none',
  },
  outline: {
    background: 'var(--color-transparent)',
    color: COLORS.orange,
    border: `1.5px solid ${COLORS.orange}`,
  },
  ghost: {
    background: 'var(--color-transparent)',
    color: COLORS.primary,
    border: 'none',
  },
};

const sizes = {
  sm: { padding: '6px 12px', fontSize: '13px', borderRadius: '8px' },
  md: { padding: '10px 20px', fontSize: '15px', borderRadius: '10px' },
  lg: { padding: '14px 28px', fontSize: '16px', borderRadius: '12px' },
};

/**
 * Botão reutilizável
 * @param {'primary'|'secondary'|'outline'|'ghost'} variant
 * @param {'sm'|'md'|'lg'} size
 * @param {boolean} loading - desabilita o botão e troca o texto por "Carregando..."
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  onClick,
  style = {},
  ...props
}) => {
  const v = variants[variant] || variants.primary;
  const s = sizes[size] || sizes.md;
  const isDisabled = disabled || loading;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      aria-busy={loading}
      style={{
        ...v,
        ...s,
        width: fullWidth ? '100%' : 'auto',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled ? 0.5 : 1,
        fontWeight: 600,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        transition: 'opacity 0.2s, transform 0.1s',
        ...style,
      }}
      {...props}
    >
      {loading ? 'Carregando...' : children}
    </button>
  );
};

export default Button;
