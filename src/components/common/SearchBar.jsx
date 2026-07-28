import { useState } from "react";

import { COLORS } from "../../constants";
import Button from "./Button";
import "./SearchBar.css";

export default function SearchBar({
  value,
  onChange,
  onSearch,
  onClear,
  placeholder = "Seu local (rua, bairro ou cidade)",
  loading = false,
  aviso = null,
  localAtivo = false,
  enderecoUsuario = null,
}) {
  const [mostrarSugestao, setMostrarSugestao] = useState(false);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      onSearch?.();
    }
  };

  const handleChange = (event) => {
    onChange(event.target.value);
    setMostrarSugestao(Boolean(enderecoUsuario && !event.target.value));
  };

  const handleAddressSuggestion = () => {
    onChange(enderecoUsuario);
    setMostrarSugestao(false);
    onSearch?.();
  };

  return (
    <div className="search-bar-wrapper">
      <div className="search-bar-row">
        <div className="search-bar-input-wrapper">
          <input
            className="search-bar-input"
            value={value}
            onChange={handleChange}
            onFocus={() =>
              setMostrarSugestao(Boolean(enderecoUsuario && !value))
            }
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            aria-label="Buscar endereço"
          />

          {value && (
            <button
              type="button"
              className="search-bar-clear"
              onClick={onClear}
              aria-label="Limpar busca"
            >
              ×
            </button>
          )}

          {mostrarSugestao && (
            <button
              type="button"
              className="search-bar-suggestion"
              onClick={handleAddressSuggestion}
            >
              Usar meu endereço: {enderecoUsuario}
            </button>
          )}
        </div>

        <Button
          onClick={onSearch}
          disabled={loading}
          loading={loading}
          background={COLORS.primary}
          color={COLORS.white}
        >
          Buscar
        </Button>
      </div>

      {aviso && (
        <p className={`search-bar-notice ${localAtivo ? "active" : ""}`}>
          {aviso}
        </p>
      )}
    </div>
  );
}
