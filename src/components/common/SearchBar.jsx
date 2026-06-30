import React from 'react';
import { COLORS } from '../../constants';
import Button from './Button';
import './SearchBar.css';

// Barra de busca reutilizável
const SearchBar = ({
  value,
  onChange,
  onSearch,
  placeholder = 'Busca por Nome'
}) => {

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') onSearch?.();
  };

  return (
    <div className="search-bar">

      <input
        className="search-input"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        style={{
          borderColor: COLORS.border,
          color: COLORS.textPrimary,
          background: COLORS.white
        }}
      />

      <Button
        className="search-button"
        onClick={onSearch}
        size="md"
      >
        Pesquisar
      </Button>

    </div>
  );
};

export default SearchBar;