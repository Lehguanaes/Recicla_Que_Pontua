import React from 'react';
import { COLORS } from '../../constants';
import Button from './Button';

/**
 * Barra de busca por nome (IBL 03)
 */
const SearchBar = ({ value, onChange, onSearch, placeholder = 'Busca por Nome' }) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') onSearch?.();
  };

  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        style={{
          flex: 1,
          padding: '10px 14px',
          borderRadius: '10px',
          border: `1.5px solid ${COLORS.border}`,
          fontSize: '15px',
          color: COLORS.textPrimary,
          outline: 'none',
          background: COLORS.white,
        }}
      />
      <Button onClick={onSearch} size="md">
        Pesquisar
      </Button>
    </div>
  );
};

export default SearchBar;
