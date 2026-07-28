import React from 'react';
import { COLORS } from '../../constants';
import Button from './Button';
import './SearchBar.css';
import { useState } from "react";

// Barra de busca reutilizável. Também é usada como busca por "seu local":
// quando `value` tem texto, a busca passa a ser feita a partir do endereço
// digitado (temporário) em vez do endereço cadastrado no perfil.
export default function SearchBar({
  value,
  onChange,
  onSearch,
  onClear,
  placeholder = 'Seu local (rua, bairro ou cidade)',
  loading = false,
  aviso = null,
  localAtivo = false,
  enderecoUsuario = null,
}){

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') onSearch?.();
  };
  const [mostrarSugestao, setMostrarSugestao] = useState(false);

  return (
    <div className="search-bar-wrapper">
      <div className="search-bar">
        <input
          className="search-input"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
           onFocus={() => setMostrarSugestao(true)}
    onBlur={() =>
        setTimeout(() => setMostrarSugestao(false), 150)
    }
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          style={{
            borderColor: COLORS.border,
            color: COLORS.textPrimary,
            background: COLORS.white
          }}
        />
        {mostrarSugestao && enderecoUsuario && (
        <div className="search-suggestions">

            <button
                type="button"
                className="search-suggestion"
                onClick={() => {
                    onChange(enderecoUsuario);
                    setMostrarSugestao(false);
                    onSearch?.();
                }}
            >
                <strong>📍 Usar meu endereço cadastrado</strong>

                <span>{enderecoUsuario}</span>
            </button>

        </div>
    )}
        {localAtivo && (
          <button
            type="button"
            className="search-clear-button"
            onClick={onClear}
            aria-label="Voltar para o endereço cadastrado"
            title="Voltar para o endereço cadastrado"
          >
            ✕
          </button>
        )}

        <Button
          className="search-button"
          onClick={onSearch}
          size="md"
          disabled={loading}
        >
          {loading ? 'Buscando...' : 'Pesquisar'}
        </Button>

      </div>

      {aviso && <span className="search-bar-aviso">{aviso}</span>}
    </div>
  );
};

