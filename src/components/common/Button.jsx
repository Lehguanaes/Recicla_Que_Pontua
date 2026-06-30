import React from 'react';
import { COLORS } from '../../constants';

const variants = {
  primary: {
    background: 'transparent',
    color: COLORS.orange,
    border: `1.5px solid ${COLORS.orange}`,
  },
  secondary: {
    background: COLORS.secondary,
    color: COLORS.white,
    border: 'none',
  },
  outline: {
    background: 'transparent',
    color: COLORS.orange,
    border: `1.5px solid ${COLORS.orange}`,
  },
  ghost: {
    background: 'transparent',
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
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  onClick,
  style = {},
  ...props
}) => {
  const v = variants[variant] || variants.primary;
  const s = sizes[size] || sizes.md;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...v,
        ...s,
        width: fullWidth ? '100%' : 'auto',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
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
      {children}
    </button>
  );
};

export default Button;
